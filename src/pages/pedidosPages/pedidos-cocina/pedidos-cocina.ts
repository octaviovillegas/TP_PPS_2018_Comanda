import { UsuariosProvider } from "./../../../providers/usuarios/usuarios";
import { MesasProvider } from "./../../../providers/mesas/mesas";
import { IComanda } from "./../../../clases/IComanda";
import { UtilProvider } from "./../../../providers/util/util";
import { Subscription } from "rxjs";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, MenuController } from "ionic-angular";
import { ComandaProvider } from "../../../providers/comanda/comanda";
import { platosProvider } from "../../../providers/platos/plato";
import { bebidasProvider } from "../../../providers/bebidas/bebidas";
import { IComandaPedido } from "../../../clases/IComandaPedido";

@IonicPage()
@Component({
  selector: "page-pedidos-cocina",
  templateUrl: "pedidos-cocina.html"
})
export class PedidosCocinaPage {
  mesa: string;
  estado: string = "pendiente";
  listaPedidosPendientes: Array<any> = [];
  listaPedidosEnPreparacion: Array<any> = [];
  //listaPedidosPreparando: Array<any> = [];
  subs: Subscription;
  //comanda;
  bebidas: any[];
  cocina: any[];
  automatico: Boolean = true;
  perfil: string = "";
  comandas: IComanda[][];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _comandas: ComandaProvider,
    public _mesas: MesasProvider,
    public _usuarios: UsuariosProvider,
    public _utils: UtilProvider,
    public _platos: platosProvider,
    public _bebidas: bebidasProvider,
    public menuCtrl: MenuController
  ) {

    this.menuCtrl.enable(true, "menu");
    this.perfil = localStorage.getItem("perfil");
  }

  ionViewWillEnter() {
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

  buscarComanda() {
    //Recorro las comandas abiertas
    this.subs = this._comandas.comandasAbiertas
      .valueChanges()
      .subscribe(data => {
        let comanda: any;
        this.comandas = data;

        this.listaPedidosPendientes = [];
        this.listaPedidosEnPreparacion = [];

        //Recorro las comandas
        for (let i = 0; i < data.length; i++) {
          comanda = data[i];

          this.armarListasEstados(comanda).then(() => {
            // console.log(this.cocina);
            // console.log(this.bebidas);
            // if (this.listaPedidosPendientes.length == 0)
            //   if (this.listaPedidosEnPreparacion.length == 0)
            //     if (this.listaPedidosEntregados.length > 0)
            //       this.todoEntregado = true;
          });
        }
      });
  }

  armarComandaPendiente(mesaID: number, mozoID: string): Promise<any> {
    return new Promise<any>(resolve => {
      Promise.all([
        this._mesas.buscarNroMesa(mesaID),
        this._usuarios.buscarNombreYApellido(mozoID)
      ]).then(data => {
        //Devuelvo la comanda con la mesa y mozo
        resolve({
          mesa: data[0],
          mozo: data[1]
        });
      });
    });
  }

  async armarListasEstados(comanda: IComanda): Promise<any> {
    let promesa = new Promise(async (resolve, reject) => {
      let hora: string = "";

      if (comanda.pedidos != null) {
        await this.armarComandaPendiente(comanda.mesa, comanda.MozoId).then(
          async data => {
            //Recorro los pedidos
            for (let i = 0; i < comanda.pedidos.length; i++) {
              //hora = this._utils.convertirAHora(this.comanda.pedidos[i].id);

              if (comanda.pedidos[i].estado == "Derivado") {
                if (this.perfil == "Bartender") {
                  await this.armarListaBebidas(comanda.pedidos[i]).then(() => {
                    let item = {
                      comandaID: comanda.id,
                      mesa: data.mesa,
                      mozo: data.mozo,
                      id: comanda.pedidos[i].id,
                      hora: hora,
                      estado: comanda.pedidos[i].estado,
                      estadoSubpedidosBebida:
                        comanda.pedidos[i].subPedidosBebida.estado,
                      tiempoEstimado: comanda.pedidos[i].tiempoMayorEstimado,
                      horaDerivado: comanda.pedidos[i].horaDerivado,
                      items: this.bebidas
                    };

                    if (this.bebidas != null) {
                      if (comanda.pedidos[i].subPedidosBebida.estado == "Derivado") {

                        this.listaPedidosPendientes.push(item);

                      } else if (comanda.pedidos[i].subPedidosBebida.estado == "En Preparacion") {
                        this.listaPedidosEnPreparacion.push(item);
                      }
                    }
                  });
                } else if (this.perfil == "Cocinero") {
                  await this.armarListaComidas(comanda.pedidos[i]).then(() => {
                    let item = {
                      comandaID: comanda.id,
                      mesa: data.mesa,
                      mozo: data.mozo,
                      id: comanda.pedidos[i].id,
                      hora: hora,
                      estado: comanda.pedidos[i].estado,
                      estadoSubpedidosCocina:
                        comanda.pedidos[i].subPedidosCocina.estado,
                      tiempoEstimado:
                        comanda.pedidos[i].tiempoMayorEstimado,
                        horaDerivado: comanda.pedidos[i].horaDerivado,
                      items: this.cocina
                    };

                    if (this.cocina != null) {
                      if (
                        comanda.pedidos[i].subPedidosCocina.estado == "Derivado"
                      ) {
                        this.listaPedidosPendientes.push(item);
                      } else if (
                        comanda.pedidos[i].subPedidosCocina.estado == "En Preparacion"
                      ) {
                        this.listaPedidosEnPreparacion.push(item);
                      }
                    }
                  });
                }
              }
            }
          }
        );
      }
      resolve();
    });

    return promesa;
  }

  async armarListaBebidas(pedido: IComandaPedido): Promise<any> {
    let promesa = new Promise(async (resolve, reject) => {
      if (pedido.subPedidosBebida.items != null) {
        await this.buscarBebidas(pedido.subPedidosBebida.items)
          .then(lista => {
            this.bebidas = lista;
            resolve();
          })
          .catch(() => reject());
      } else {
        this.bebidas = null;
        resolve();
      }
    });
    return promesa;
  }

  async armarListaComidas(pedido: IComandaPedido): Promise<any> {
    let promesa = new Promise(async (resolve, reject) => {
      if (pedido.subPedidosCocina.items != null) {
        this.buscarPlatos(pedido.subPedidosCocina.items)
          .then(lista => {
            this.cocina = lista;
            resolve();
          })
          .catch(() => reject());
      } else {
        this.cocina = null;
        resolve();
      }
    });
    return promesa;
  }

  async buscarBebidas(subPedidoBebidas: any) {
    let lbebidas = [];
    let promesa = new Promise<any[]>(async (resolve, reject) => {
      await subPedidoBebidas.forEach(itemBebida => {
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

  async buscarPlatos(subpedidoCocina: any) {
    let lPlatos = [];
    let promesa = new Promise<any[]>(async (resolve, reject) => {
      await subpedidoCocina.forEach(itemPlato => {
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

  cambiarEstadoPedido(event: any) {
    this.automatico = false;
    let prom: any;
    let encontro: boolean= false;

    this._utils.presentLoading("Cambiando estado...");


    for (let i = 0; i < this.comandas.length; i++) {
      prom = this.comandas[i];

      if (prom.id == event.idComanda) {

        for (let j = 0; j < prom.pedidos.length; j++) {

          if (prom.pedidos[j].id == event.idPedido) {
            encontro = true;

            if (this.perfil == "Bartender") {
              console.log("BARTENDER");
              console.log(prom.pedidos[j].subPedidosBebida.estado);
              prom.pedidos[j].subPedidosBebida.estado = event.estadoPedido;
            }
              
            if (this.perfil == "Cocinero") {
              console.log("COCINERO");
              console.log(prom.pedidos[j].subPedidosCocina.estado);
              prom.pedidos[j].subPedidosCocina.estado = event.estadoPedido;
            }
  
            break;
          }
        }
      }

      if(encontro)
        break;
    }

    this._comandas.actualizarComanda(prom).then(
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
}
