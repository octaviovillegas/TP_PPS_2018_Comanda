import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MesasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mesas',
  templateUrl: 'mesas.html',
})
export class MesasPage {

  public listaMesas = [];
  estados: string = "6";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let obj1 = { "id": 1, "numero": 1, "estado": "Abierta" };
    let obj2 = { "id": 2, "numero": 2, "estado": "Comiendo" };
    let obj3 = { "id": 3, "numero": 3, "estado": "Esperando pedido" };
    let obj4 = { "id": 4, "numero": 4, "estado": "Esperando cobro" };
    this.listaMesas.push(obj1);
    this.listaMesas.push(obj2);
    this.listaMesas.push(obj3);
    this.listaMesas.push(obj4);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MesasPage');
  }

}
