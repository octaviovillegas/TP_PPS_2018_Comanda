import { forEach } from "@firebase/util";
import { bebidasProvider } from "./../../../providers/bebidas/bebidas";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AltaPedidoPage } from "../alta-pedido/alta-pedido";
import { IComanda } from "../../../clases/IComanda";
import { ComandaProvider } from "../../../providers/comanda/comanda";
import { UtilProvider } from "../../../providers/util/util";
import { platosProvider } from "../../../providers/platos/plato";
import { ISubPedido } from "../../../clases/ISubPedido";
import { IComandaPedido } from "../../../clases/IComandaPedido";

/**
 * Generated class for the PedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pedidos",
  templateUrl: "pedidos.html"
})
export class PedidosPage {
  estado: string = "pendiente";
  isAndroid: boolean = false;
  mesa: any;
  comanda: IComanda;
  listaPedidosDerivados: Array<any> = [];
  listaPedidosEntregados: Array<any> = [];
  listaPedidosPendientes: Array<any> = [];

  bebidas: any[];
  cocina: any[];

  userID: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _utils: UtilProvider,
    public _comandas: ComandaProvider,
    public _bebidas: bebidasProvider,
    public _platos: platosProvider
  ) {
    this.mesa = this.navParams.get("mesa");
    this.comanda = this.navParams.get("comanda");
    this.userID = localStorage.getItem("userID");

    this.buscarComanda().then(com => {
      this.comanda = com;

      this.armarListasEstados().then(()=> console.log("OK"));
    });
  }

  armarListasEstados(): Promise<any> {
    let promesa = new Promise(async (resolve, reject) => {
      let hora: string = "";
      for (let i = 0; i < this.comanda.pedidos.length; i++) {
        hora = this._utils.convertirAHora(this.comanda.pedidos[i].id);

        switch (this.comanda.pedidos[i].estado) {
          case "Pendiente":
            await this.armarListas(this.comanda.pedidos[i]).then(() => {
              this.listaPedidosPendientes.push({
                id: this.comanda.pedidos[i].id,
                hora: hora,
                estado: this.comanda.pedidos[i].estado,
                tiempoEstimado: this.comanda.pedidos[i].tiempoMayorEstimado,
                subpedidoBebidas: this.bebidas,
                subpedidoCocina: this.cocina
              });
            });
           
            break;
          case "Derivado":
            await this.armarListas(this.comanda.pedidos[i])
            .then(() => {
              this.listaPedidosDerivados.push({
                id: this.comanda.pedidos[i].id,
                hora: hora,
                estado: this.comanda.pedidos[i].estado,
                estadoSubpedidosBebida: this.comanda.pedidos[i].subPedidosBebida
                  .estado,
                estadoSubpedidosCocina: this.comanda.pedidos[i].subPedidosCocina
                  .estado,
                tiempoEstimado: this.comanda.pedidos[i].tiempoMayorEstimado,
                subpedidoBebidas: this.bebidas,
                subpedidoCocina: this.cocina
              });
            });
            
            break;
          case "Entregado":
            await this.armarListas(this.comanda.pedidos[i]).then(() => {
              let importeTotal: number = 0;

              for (let j = 0; j < this.bebidas.length; j++) {
                importeTotal = importeTotal + this.bebidas[j].precio;
              }

              for (let j = 0; j < this.cocina.length; j++) {
                importeTotal = importeTotal + this.cocina[j].precio;
              }

              this.listaPedidosEntregados.push({
                id: this.comanda.pedidos[i].id,
                hora: hora,
                estado: this.comanda.pedidos[i].estado,
                subpedidoBebidas: this.bebidas,
                subpedidoCocina: this.cocina,
                importeTotal: importeTotal
              });
            });
            break;
        }
      }

      resolve();
    });

    return promesa;
  }

  // VER DE RECORRER POR ESETADOS E IR ARMANDO LAS LISTAS POR ESTADO.
  buscarComanda(): Promise<IComanda> {
    let promesa = new Promise<IComanda>((resolve, reject) => {
      this._comandas.items.subscribe(data => {
        let encontro: Boolean = false;
        this.listaPedidosDerivados = [];
        this.listaPedidosEntregados = [];
        this.listaPedidosPendientes = [];

        for (let i = 0; i < data.length; i++) {
          if ((data[i].userID == this.userID && data[i].id == this.comanda.id)) {
            resolve(data[i] as IComanda);
            break;
          }
        }

        if (!encontro) reject();
      });
    });

    return promesa;
  }

  armarListas(pedido: IComandaPedido): Promise<any> {
    let promesa = new Promise((resolve, reject) => {
      if (pedido.subPedidosBebida.items != null) {
        this.buscarBebidas(pedido.subPedidosBebida.items).then(lista => {
          this.bebidas = lista;

          if (pedido.subPedidosCocina.items != null) {
            this.buscarPlatos(pedido.subPedidosCocina.items)
              .then(lista => {
                this.cocina = lista;
                resolve();
              })
              .catch(() => reject());
          } else {
            resolve();
          }
        });
      } else {
        if (pedido.subPedidosCocina.items != null) {
          this.buscarPlatos(pedido.subPedidosCocina.items)
            .then(lista => {
              this.cocina = lista;
              resolve();
            })
            .catch(() => reject());
        } else {
          resolve();
        }
      }
    });

    return promesa;
  }

  buscarBebidas(subPedidoBebidas: any) {
    let lbebidas = [];

    let promesa = new Promise<any[]>((resolve, reject) => {
      subPedidoBebidas.forEach(itemBebida => {
        this._bebidas
          .traerBebida(itemBebida.bebidaID)
          .then((b: any) => {
            lbebidas.push({
              cantidad: itemBebida.cantidad,
              bebida: b,
              precio: Number(b.importe) * Number(itemBebida.cantidad)
            });

            resolve(lbebidas);
          })
          .catch(() => {
            reject();
          });
      });
    });

    return promesa;
  }

  buscarPlatos(subpedidoCocina: any) {
    let lPlatos = [];

    let promesa = new Promise<any[]>((resolve, reject) => {
      subpedidoCocina.forEach(itemPlato => {
        this._platos
          .traerPlato(itemPlato.platoID)
          .then((p: any) => {
            lPlatos.push({
              cantidad: itemPlato.cantidad,
              plato: p,
              precio: Number(p.importe) * Number(itemPlato.cantidad)
            });

            resolve(lPlatos);
          })
          .catch(() => {
            reject();
          });
      });
    });

    return promesa;
  }

  nuevoPedido() {
    this.navCtrl.push(AltaPedidoPage, {
      mesa: this.mesa,
      comanda: this.comanda
    });
  }

  cambiarEstadoPedido(event: any) {

    for (let i = 0; i < this.comanda.pedidos.length; i++) {
      if (this.comanda.pedidos[i].id == event.idPedido) {
        this.comanda.pedidos[i].estado = event.estadoPedido;
        this.comanda.pedidos[i].subPedidosBebida.estado = event.estadoPedido;
        this.comanda.pedidos[i].subPedidosCocina.estado = event.estadoPedido;
        break;
      }
    }

    this._comandas.actualizarComanda(this.comanda).then(
      () => {
        this._utils.mostrarMensaje("Se derivó el pedido");

        setTimeout(() => {
          this.navCtrl.pop();
        }, 2000);
      },
      () => {
        this._utils.mostrarMensaje("Reintente por favor");
      }
    );
  }

  entregarPedido(event: any) {
    // console.log("ESTADO PEDIDO: ");
    // console.log(event.estadoPedido);
    // console.log(event.categoriaSubp);
    // console.log(event.idPedido);

    for (let i = 0; i < this.comanda.pedidos.length; i++) {
      if (this.comanda.pedidos[i].id == event.idPedido) {
        if (event.categoriaSubp == "cocina") {
          this.comanda.pedidos[i].subPedidosCocina.estado = event.estadoPedido;
        } else if (event.categoriaSubp == "bebida") {
          this.comanda.pedidos[i].subPedidosBebida.estado = event.estadoPedido;
        }
        if (
          this.comanda.pedidos[i].subPedidosBebida.estado == "Entregado" &&
          this.comanda.pedidos[i].subPedidosCocina.estado == "Entregado"
        ) {
          this.comanda.pedidos[i].estado = event.estadoPedido;
        }
        break;
      }
    }

    this._comandas.actualizarComanda(this.comanda).then(
      () => {
        this._utils.mostrarMensaje("Se entregó el pedido");

        setTimeout(() => {
          this.navCtrl.pop();
        }, 2000);
      },
      () => {
        this._utils.mostrarMensaje("Reintente por favor");
      }
    );
  }
}
