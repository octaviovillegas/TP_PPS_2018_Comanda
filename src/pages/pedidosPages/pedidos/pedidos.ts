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
import { Subscription } from "rxjs";

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
  mesa: number;
  mesaKey: string;
  comanda: IComanda;
  listaPedidosDerivados: Array<any> = [];
  listaPedidosEntregados: Array<any> = [];
  listaPedidosPendientes: Array<any> = [];

  bebidas: any[];
  cocina: any[];

  userID: string = "";

  total: number = 0;
  todoEntregado: Boolean = false;
  subs: Subscription;
  automatico: Boolean = true; //Indica si la actualizacion de la pantalla es automatica. Esto sirve para cuando el bartender o cocinero cambian un estado.
  perfil:string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _utils: UtilProvider,
    public _comandas: ComandaProvider,
    public _bebidas: bebidasProvider,
    public _platos: platosProvider
  ) {
    this.mesa = parseInt(this.navParams.get("mesa"));
    this.mesaKey = this.navParams.get("mesaKey");
    this.comanda = this.navParams.get("comanda");
    this.userID = localStorage.getItem("userID");
  }

  ionViewWillEnter() {
    this.perfil = localStorage.getItem("perfil");
    this.automatico = false;
    this.inicializar();

    setTimeout(() => {
      this.automatico = true;
    }, 2000);
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
  }

  inicializar() {
    this.buscarComanda();
  }

  armarListasEstados(): Promise<any> {
    let promesa = new Promise(async (resolve, reject) => {
      let hora: string = "";

      if (this.comanda.pedidos != null) {
        let importeTotal: number = 0;

        for (let i = 0; i < this.comanda.pedidos.length; i++) {
          importeTotal = 0;
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
              await this.armarListas(this.comanda.pedidos[i]).then(() => {
                this.listaPedidosDerivados.push({
                  id: this.comanda.pedidos[i].id,
                  hora: hora,
                  estado: this.comanda.pedidos[i].estado,
                  estadoSubpedidosBebida: this.comanda.pedidos[i].subPedidosBebida.estado,
                  estadoSubpedidosCocina: this.comanda.pedidos[i].subPedidosCocina.estado,
                  tiempoEstimado: this.comanda.pedidos[i].tiempoMayorEstimado,
                  horaDerivado: this.comanda.pedidos[i].horaDerivado,
                  subpedidoBebidas: this.bebidas,
                  subpedidoCocina: this.cocina
                });
              });

              break;
            case "Entregado":
              await this.armarListas(this.comanda.pedidos[i]).then(() => {

                if (this.bebidas != null) {
                  for (let j = 0; j < this.bebidas.length; j++) {
                    importeTotal = importeTotal + (this.bebidas[j].precio * this.comanda.pedidos[i].subPedidosBebida.items[j].cantidad);
                  }
                }

                if (this.cocina != null) {
                  for (let j = 0; j < this.cocina.length; j++) {
                    importeTotal = importeTotal + (this.cocina[j].precio * this.comanda.pedidos[i].subPedidosCocina.items[j].cantidad);
                  }
                }

                this.total += importeTotal;
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
      }

      resolve();
    });

    return promesa;
  }

  buscarComanda() {

    this.subs = this._comandas.lista.valueChanges().subscribe(data => {
      if (this.automatico)
        this._utils.presentLoading("Actualizando pedidos...");

      this.listaPedidosDerivados = [];
      this.listaPedidosEntregados = [];
      this.listaPedidosPendientes = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].userID == this.userID && data[i].id == this.comanda.id) {
          //resolve(data[i] as IComanda);
          this.comanda = data[i];
          this.total = 0;
          this.todoEntregado = false;

          this.armarListasEstados().then(() => {
            if (this.listaPedidosPendientes.length == 0)
              if (this.listaPedidosDerivados.length == 0)
                if (this.listaPedidosEntregados.length > 0)
                  this.todoEntregado = true;
          });

          if (this.automatico) {
            setTimeout(() => {
              this._utils.dismiss().then(() => {});
            }, 2000);
          }

          break;
        }
      }
    });

    //})
    // .then(com=>{
    //   this.comanda = com;
    //   this.total = 0;
    //   this.todoEntregado = false;

    //   console.log("COMANDA");
    //   console.log(com);
    //   this.armarListasEstados().then(() => {
    //     if (this.listaPedidosPendientes.length == 0)
    //       if (this.listaPedidosDerivados.length == 0)
    //         if (this.listaPedidosEntregados.length > 0)
    //           this.todoEntregado = true;
    //   });
    // });

    //return promesa;
  }

  armarListas(pedido: IComandaPedido): Promise<Boolean> {
    let promesa = new Promise<Boolean>((resolve, reject) => {
      Promise.all([
        this.buscarPlatos(pedido.subPedidosCocina.items),
        this.buscarBebidas(pedido.subPedidosBebida.items)
      ]).then(res => {

        setTimeout(() => {
          this.cocina = res[0];
          this.bebidas = res[1];
          
          resolve(true);
        }, 1000);
      });
    });

    return promesa;
  }

  buscarBebidas(subPedidoBebidas: any) {
    let lbebidas = [];

    let promesa = new Promise<any[]>(async (resolve, reject) => {
      if (subPedidoBebidas != null) {
        await subPedidoBebidas.forEach(async itemBebida => {
          await this._bebidas
            .traerBebida(itemBebida.bebidaID)
            .then((b: any) => {
              lbebidas.push({
                cantidad: itemBebida.cantidad,
                bebida: b,
                precio: Number(b.importe) * Number(itemBebida.cantidad)
              });

            })
            .catch(() => {
              reject();
            });
        });

        resolve(lbebidas);
      } else {
        resolve(null);
      }
    });

    return promesa;
  }

  buscarPlatos(subpedidoCocina: any) {
    let lPlatos = [];

    let promesa = new Promise<any[]>(async (resolve, reject) => {
      if (subpedidoCocina != null) {
        await subpedidoCocina.forEach(async itemPlato => {
          await this._platos
            .traerPlato(itemPlato.platoID)
            .then((p: any) => {
              lPlatos.push({
                cantidad: itemPlato.cantidad,
                plato: p,
                precio: Number(p.importe) * Number(itemPlato.cantidad)
              });

            })
            .catch(() => {
              reject();
            });
        });
        resolve(lPlatos);
      } else {
        resolve(null);
      }
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
    this.automatico = false;
    this._utils.presentLoading("Derivando pedido...");

    for (let i = 0; i < this.comanda.pedidos.length; i++) {
      if (this.comanda.pedidos[i].id == event.idPedido) {
        this.comanda.pedidos[i].estado = event.estadoPedido;
        this.comanda.pedidos[i].horaDerivado = new Date().valueOf();
        this.comanda.pedidos[i].subPedidosBebida.estado = event.estadoPedido;
        this.comanda.pedidos[i].subPedidosCocina.estado = event.estadoPedido;

        break;
      }
    }

    this._comandas.actualizarComanda(this.comanda).then(
      () => {
        //this._utils.mostrarMensaje("Se derivó el pedido");

        //this.inicializar();
        setTimeout(() => {
          this._utils.dismiss();
          this.automatico = true;
          //this.navCtrl.pop();
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

    this.automatico = false;
    this._utils.presentLoading("Entregando pedido...");

    for (let i = 0; i < this.comanda.pedidos.length; i++) {
      if (this.comanda.pedidos[i].id == event.idPedido) {
        if (event.categoriaSubp == "cocina") {
          this.comanda.pedidos[i].subPedidosCocina.estado = event.estadoPedido;
        } else if (event.categoriaSubp == "bebida") {
          this.comanda.pedidos[i].subPedidosBebida.estado = event.estadoPedido;
        }

        if (
          this.comanda.pedidos[i].subPedidosBebida.estado == "Entregado" &&
          this.comanda.pedidos[i].subPedidosCocina.items == null
        )
          this.comanda.pedidos[i].estado = event.estadoPedido;

        if (
          this.comanda.pedidos[i].subPedidosCocina.estado == "Entregado" &&
          this.comanda.pedidos[i].subPedidosBebida.items == null
        )
          this.comanda.pedidos[i].estado = event.estadoPedido;

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
        //this._utils.mostrarMensaje("Se entregó el pedido");

        //this.inicializar();

        setTimeout(() => {
          //this._comandas.subs.unsubscribe();
          this._utils.dismiss();
          this.automatico = true;
          //this.navCtrl.pop();
        }, 2000);
      },
      () => {
        this._utils.mostrarMensaje("Reintente por favor");
      }
    );
  }

  cerrarComanda() {
    this._utils.presentLoading("Cerrando mesa...");

    this.comanda.estado = "Cerrada";

    this._comandas.cerrarComanda(this.comanda, this.mesaKey).then(() => {
      this.todoEntregado = false;
      this.total = 0;

      setTimeout(() => {
        this.subs.unsubscribe();
        this._utils.dismiss().then(() => 
        this.navCtrl.pop());

      }, 3000);
    });
  }
}
