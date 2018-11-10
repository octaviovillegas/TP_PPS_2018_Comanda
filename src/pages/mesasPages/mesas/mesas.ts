import { UtilProvider } from './../../../providers/util/util';
import { IMesa } from "./../../../clases/IMesa";
import { MesasProvider } from "./../../../providers/mesas/mesas";
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
import { ComandaProvider } from "../../../providers/comanda/comanda";
import { IComanda } from "../../../clases/IComanda";

@IonicPage()
@Component({
  selector: "page-mesas",
  templateUrl: "mesas.html"
})
export class MesasPage {
  public listaMesas: IMesa[] = [];
  //public items: Observable<any[]>;

  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public menuCtrl: MenuController,
    public _mesas: MesasProvider,
    public _comandas: ComandaProvider,
    public utilProvider: UtilProvider
  ) {
    this.menuCtrl.enable(true, "menu");

    _mesas.listaMesas.valueChanges().subscribe((value: IMesa[]) => {
      this.listaMesas = value;
    });
  }

  cerrar(mesa: any, item: ItemSliding) {
    mesa.estado = "Libre";
    //console.log(this.listaMesas);
    this.expandAction(item, "Cerrando", "Mesa cerrada.");
  }

  bloquear(mesa: any, item: ItemSliding) {
    mesa.estado = "Bloqueada";
    //console.log(this.listaMesas);
    this.expandAction(item, "Bloqueando", "Mesa bloqueada.");
  }

  desbloquear(mesa: any, item: ItemSliding) {
    mesa.estado = "Libre";
    //console.log(this.listaMesas);
    this.expandAction(item, "Desbloqueando", "Mesa libre.");
  }

  abrir(mesa: any, item: ItemSliding) {
    mesa.estado = "Abierta";
    //console.log(this.listaMesas);
    this.expandAction(item, "Abriendo", "Mesa abierta.");
  }

  agregarPedidos(mesaNumero: number, comandaID: number) {
    //console.log("abrir pedidos");

    this.verificarComandaUsuario(mesaNumero, comandaID);
  }

  verificarComandaUsuario(mesaNumero: number, comandaID: number) {

    this._comandas.verificarComandaPorUsuario(comandaID).then((comanda:IComanda)=>{
      
      //La comanda le pertenece al usuario
      if(comanda != null) {
        this.navCtrl.push(PedidosPage, {
          mesa: mesaNumero,
          comanda: comanda
        });  
      } else {
        this.utilProvider.mostrarMensaje("La comanda es de otro Mozo");
      }
      
    }, ()=>{return false;});
  }

  abrirComandaConMesa(mesa: IMesa, mesaKey: string) {
    //console.log("abrir pedidos");

    this.navCtrl.push("AltaComandaPage", { mesa: mesa, mesaKey: mesaKey });

    //this.navCtrl.push(PedidosPage, { mesa: mesaID });
  }

  irAltaComanda() {
    this.navCtrl.push("AltaComandaPage", { mesa: null });
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
