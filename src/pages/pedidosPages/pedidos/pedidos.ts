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

    // this.inicializar();
  }

  ionViewWillEnter() {
    this.automatico = false;
    this.inicializar();

    setTimeout(() => {
      this.automatico = true;  
    }, 2000);
    
  }

  ionViewWillLeave() {
    //console.log("UNSUBSCRIBE");
    this.subs.unsubscribe();
  }

  inicializar() {
    this.buscarComanda();

    // this.buscarComanda().then(com => {
    //   this.comanda = com;
    //   this.total = 0;

    //   //Para que no quede linkeado constantemente
    //   // setTimeout(() => {
    //   //   this.subs.unsubscribe();
    //   // }, 2000);

    //   this.armarListasEstados().then(() => {
    //     if (this.listaPedidosPendientes.length == 0)
    //       if (this.listaPedidosDerivados.length == 0)
    //         if (this.listaPedidosEntregados.length > 0)
    //           this.todoEntregado = true;
    //   });
    // });
  }

  armarListasEstados(): Promise<any> {
    let promesa = new Promise(async (resolve, reject) => {
      let hora: string = "";

      if (this.comanda.pedidos != null) {
        let importeTotal: number = 0;

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
              await this.armarListas(this.comanda.pedidos[i]).then(() => {
                this.listaPedidosDerivados.push({
                  id: this.comanda.pedidos[i].id,
                  hora: hora,
                  estado: this.comanda.pedidos[i].estado,
                  estadoSubpedidosBebida: this.comanda.pedidos[i]
                    .subPedidosBebida.estado,
                  estadoSubpedidosCocina: this.comanda.pedidos[i]
                    .subPedidosCocina.estado,
                  tiempoEstimado: this.comanda.pedidos[i].tiempoMayorEstimado,
                  subpedidoBebidas: this.bebidas,
                  subpedidoCocina: this.cocina
                });
              });

              break;
            case "Entregado":
              await this.armarListas(this.comanda.pedidos[i]).then(() => {

                console.log("BEBIDAS");
                console.log(this.bebidas);
                if(this.bebidas != null) {
                  for (let j = 0; j < this.bebidas.length; j++) {
                    console.log("IMPORTE");
                    console.log(this.bebidas[j].precio);
                    importeTotal = importeTotal + this.bebidas[j].precio;
                  }
                }

                console.log("COCINA");
                console.log(this.cocina);
                if(this.cocina != null) {
                  for (let j = 0; j < this.cocina.length; j++) {
                    console.log("IMPORTE");
                    console.log(this.cocina[j].precio);
                    importeTotal = importeTotal + this.cocina[j].precio;
                  }
                }

                console.log(this.comanda.pedidos[i].id);
                console.log(importeTotal);

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

  // VER DE RECORRER POR ESETADOS E IR ARMANDO LAS LISTAS POR ESTADO.
  // buscarComanda(): Promise<IComanda> {
  //   let promesa = new Promise<IComanda>((resolve, reject) => {
  //     this.subs = this._comandas.items.subscribe(data => {
  //       let encontro: Boolean = false;
  //       this.listaPedidosDerivados = [];
  //       this.listaPedidosEntregados = [];
  //       this.listaPedidosPendientes = [];

  //       for (let i = 0; i < data.length; i++) {
  //         if (data[i].userID == this.userID && data[i].id == this.comanda.id) {
  //           resolve(data[i] as IComanda);
  //           break;
  //         }
  //       }

  //       if (!encontro) reject();
  //     });
  //   });

  //   return promesa;
  // }

  //buscarComanda(): Promise<IComanda> {
  buscarComanda() {
    // new Promise<IComanda>((resolve, reject) => {

    // if(this.subs!= null)
    //   this.subs.unsubscribe();

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

          // console.log("COMANDA");
          // console.log(com);
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

      //if (!encontro) reject();
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

  armarListas(pedido: IComandaPedido): Promise<any> {
    let promesa = new Promise(async (resolve, reject) => {
      if (pedido.subPedidosBebida.items != null) {
        await this.buscarBebidas(pedido.subPedidosBebida.items).then(lista => {
          this.bebidas = lista;

          new Promise(async (resolve,reject)=>{

            if (pedido.subPedidosCocina.items != null) {

              await this.buscarPlatos(pedido.subPedidosCocina.items)
                .then(lista => {
                  this.cocina = lista;
                  resolve();
                });
            } else {
              this.cocina = null;
              resolve();
            }
          }).then(()=> resolve());

        });
      } else {
        this.bebidas = null;
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
            console.log("bebida");
            console.log(b);
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
            console.log("plato");
            console.log(p);
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
    this.automatico = false;
    this._utils.presentLoading("Derivando pedido...");

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

        if(this.comanda.pedidos[i].subPedidosBebida.estado == "Entregado" && this.comanda.pedidos[i].subPedidosCocina.items == null) 
          this.comanda.pedidos[i].estado = event.estadoPedido;


        if(this.comanda.pedidos[i].subPedidosCocina.estado == "Entregado" && this.comanda.pedidos[i].subPedidosBebida.items == null) 
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
      //this._utils.mostrarMensaje("Se cerró la comanda");

      //this._comandas.subs.unsubscribe();
      setTimeout(() => {
        this.subs.unsubscribe();
        this._utils.dismiss().then(() => this.navCtrl.pop());
        //this.navCtrl.pop();
      }, 2000);
    });
  }
}
