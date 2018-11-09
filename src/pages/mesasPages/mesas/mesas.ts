import { PedidosPage } from "./../../pedidosPages/pedidos/pedidos";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ItemSliding,
  MenuController,
  DateTime
} from "ionic-angular";

/**
 * Generated class for the MesasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-mesas",
  templateUrl: "mesas.html"
})
export class MesasPage {
  public listaMesas = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(true, "menu");

    let obj1 = { id: 1, numero: 1, estado: "Abierta" };
    let obj2 = { id: 2, numero: 2, estado: "Comiendo" };
    let obj3 = { id: 3, numero: 3, estado: "Esperando pedido" };
    let obj4 = { id: 4, numero: 4, estado: "Esperando cobro" };
    let obj5 = { id: 5, numero: 5, estado: "Bloqueada" };
    let obj6 = { id: 6, numero: 6, estado: "Libre" };
    let obj7 = { id: 7, numero: 7, estado: "Libre" };
    let obj8 = { id: 8, numero: 8, estado: "Libre" };
    let obj9 = { id: 9, numero: 9, estado: "Libre" };
    this.listaMesas.push(obj1);
    this.listaMesas.push(obj2);
    this.listaMesas.push(obj3);
    this.listaMesas.push(obj4);
    this.listaMesas.push(obj5);
    this.listaMesas.push(obj6);
    this.listaMesas.push(obj7);
    this.listaMesas.push(obj8);
    this.listaMesas.push(obj9);
  }

  cerrar(mesa: any, item: ItemSliding) {
    mesa.estado = "Libre";
    console.log(this.listaMesas);
    this.expandAction(item, "Cerrando", "Mesa cerrada.");
  }

  bloquear(mesa: any, item: ItemSliding) {
    mesa.estado = "Bloqueada";
    console.log(this.listaMesas);
    this.expandAction(item, "Bloqueando", "Mesa bloqueada.");
  }

  desbloquear(mesa: any, item: ItemSliding) {
    mesa.estado = "Libre";
    console.log(this.listaMesas);
    this.expandAction(item, "Desbloqueando", "Mesa libre.");
  }

  abrir(mesa: any, item: ItemSliding) {
    mesa.estado = "Abierta";
    console.log(this.listaMesas);
    this.expandAction(item, "Abriendo", "Mesa abierta.");
  }

  abrirPedidos(mesa: any) {
    console.log("abrir pedidos");
    this.navCtrl.push(PedidosPage, { mesa: mesa });
  }

  irAltaComanda() {
    this.navCtrl.push("AltaComandaPage");
  }

  expandAction(item: ItemSliding, _: any, text: string) {
    // TODO item.setElementClass(action, true);

    setTimeout(() => {
      const toast = this.toastCtrl.create({
        message: text
      });
      toast.present();
      // TODO item.setElementClass(action, false);
      // item.close();

      setTimeout(() => toast.dismiss(), 2000);
    }, 1500);
  }
}
