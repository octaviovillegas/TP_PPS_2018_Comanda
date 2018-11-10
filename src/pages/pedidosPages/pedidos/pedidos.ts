import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AltaPedidoPage } from "../alta-pedido/alta-pedido";
import { IComanda } from "../../../clases/IComanda";
import { ComandaProvider } from "../../../providers/comanda/comanda";

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
    public _comandas: ComandaProvider
  ) {
    this.mesa = this.navParams.get("mesa");
    this.comanda = this.navParams.get("comanda");

    this.userID = localStorage.getItem("userID");
    this.buscarPedidos();
  }

  buscarPedidos() {
    this._comandas.items.subscribe(data => {
      this.listaPedidosDerivados = [];
      this.listaPedidosEntregados = [];
      this.listaPedidosPendientes = [];

      for (let i = 0; i < data.length; i++) {
        console.log(data);
        if ((data[i].userID = this.userID && data[i].id == this.comanda.id)) {
          //Muestro los Pedidos de la Comanda seleccionada

          if (data[i].pedidos != null) {
            for (let j = 0; j < data[i].pedidos.length; j++) {
              switch (data[i].pedidos[j].estado) {
                case "Pendiente":
                  let cantBe: number = 0;
                  let cantPl: number = 0;

                  if (data[i].pedidos[j].subPedidosBebida.items != null)
                    cantBe = data[i].pedidos[j].subPedidosBebida.items.length;

                  if (data[i].pedidos[j].subPedidosCocina.items != null)
                    cantPl = data[i].pedidos[j].subPedidosCocina.items.length;

                  this.listaPedidosPendientes.push({
                    id: data[i].pedidos[j].id,
                    estado: "Pendiente",
                    cantBebidas: cantBe,
                    cantPlatos: cantPl
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

      console.log(this.listaPedidosPendientes);
    });
  }

  nuevoPedido() {
    this.navCtrl.push(AltaPedidoPage, {
      mesa: this.mesa,
      comanda: this.comanda
    });
  }
}
