import { forEach } from "@firebase/util";
import { bebidasProvider } from "./../../../providers/bebidas/bebidas";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AltaPedidoPage } from "../alta-pedido/alta-pedido";
import { IComanda } from "../../../clases/IComanda";
import { ComandaProvider } from "../../../providers/comanda/comanda";
import { UtilProvider } from "../../../providers/util/util";
import { platosProvider } from "../../../providers/platos/plato";

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
    this.buscarPedidos();
  }

  buscarPedidos() {
    let bebidas;
    let cocina;

    this._comandas.items.subscribe(data => {
      this.listaPedidosDerivados = [];
      this.listaPedidosEntregados = [];
      this.listaPedidosPendientes = [];

      console.log("datos de comandas");
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        //console.log(data);
        if ((data[i].userID = this.userID && data[i].id == this.comanda.id)) {
          //Muestro los Pedidos de la Comanda seleccionada
          if (data[i].pedidos != null) {
            for (let j = 0; j < data[i].pedidos.length; j++) {
              switch (data[i].pedidos[j].estado) {
                case "Pendiente":
                  let hora = this._utils.convertirAHora(data[i].pedidos[j].id);
                  if (data[i].pedidos[j].subPedidosBebida.items != null) {
                    bebidas = this.buscarBebidas(
                      data[i].pedidos[j].subPedidosBebida.items
                    );
                  }
                  if (data[i].pedidos[j].subPedidosCocina.items != null) {
                    cocina = this.buscarPlatos(
                      data[i].pedidos[j].subPedidosCocina.items
                    );
                  }

                  this.listaPedidosPendientes.push({
                    id: data[i].pedidos[j].id,
                    hora: hora,
                    subpedidoBebidas: bebidas,
                    subpedidoCocina: cocina
                  });
                  break;
                case "Derivado":
                  this.listaPedidosDerivados.push({
                    id: data[i].pedidos[j].id,
                    estado: "Derivado"
                  });
                  break;
                case "Entregado":
                  this.listaPedidosEntregados.push({
                    id: data[i].pedidos[j].id,
                    estado: "Entregado"
                  });
                  break;
              }
            }
          }
        }
      }
      //   console.log(this.listaPedidosPendientes);
    });
  }

  buscarBebidas(subPedidoBebidas: any) {
    let lbebidas = [];
    subPedidoBebidas.forEach(itemBebida => {
      this._bebidas
        .traerBebida(itemBebida.bebidaID)
        .then((b: any) => {
          lbebidas.push({
            cantidad: itemBebida.cantidad,
            bebida: b
          });
        })
        .catch(() => {
          console.log("Falló la conexión.");
        });
    });
    return lbebidas;
  }

  buscarPlatos(subpedidoCocina: any) {
    let lPlatos = [];
    subpedidoCocina.forEach(itemPlato => {
      this._platos
        .traerPlato(itemPlato.platoID)
        .then((p: any) => {
          lPlatos.push({
            cantidad: itemPlato.cantidad,
            plato: p
          });
        })
        .catch(() => {
          console.log("Falló la conexión.");
        });
    });
    return lPlatos;
  }

  nuevoPedido() {
    this.navCtrl.push(AltaPedidoPage, {
      mesa: this.mesa,
      comanda: this.comanda
    });
  }
}
