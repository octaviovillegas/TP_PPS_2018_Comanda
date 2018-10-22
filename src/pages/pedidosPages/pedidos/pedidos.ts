import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido';

/**
 * Generated class for the PedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html',
})
export class PedidosPage {

  pet: string = "puppies";
  isAndroid: boolean = false;
  mesa: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mesa = this.navParams.get("mesa");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidosPage');
  }

  nuevoPedido(mesa: any) {
    console.log("abrir pedidos");
    this.navCtrl.push(AltaPedidoPage, { 'mesa': this.mesa });
  }

}
