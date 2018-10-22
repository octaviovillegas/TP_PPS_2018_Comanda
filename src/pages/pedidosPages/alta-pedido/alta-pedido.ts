import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AltaPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-pedido',
  templateUrl: 'alta-pedido.html',
})
export class AltaPedidoPage {

  public menuPlatos = [];
  public menuFrios = [];
  public mesa: any;
  public tipomenu: any;
  public pedido;
  cant: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.mesa = this.navParams.get("mesa");
    this.tipomenu = "minutas";


    this.menuFrios = [
      {
        "id": 1,
        "nombre": "Vitel tone",
        "descripcion": "Peceto con salsa de atun",
        "cantidad": 0,
        "pedido": true
      },
      {
        "id": 2,
        "nombre": "Ensalada rusa",
        "descripcion": "Zanahoria, Papa y arvejas con mayonesa",
        "cantidad": 1,
        "pedido": false
      }];

    this.menuPlatos = [
      {
        "id": 1,
        "nombre": "Milanesas con pure",
        "descripcion": "Ternera rebozada con pure de papa",
        "cantidad": 0,
        "pedido": true
      },
      {
        "id": 2,
        "nombre": "Suprema con papas",
        "descripcion": "Pechuga de pollo rebozada con papas fritas",
        "cantidad": 1,
        "pedido": false
      },
      {
        "id": 3,
        "nombre": "Ensalada cesar",
        "descripcion": "Ensalada de lechuga, pollo con salsa",
        "cantidad": 0,
        "pedido": true
      },
      {
        "id": 4,
        "nombre": "Mozzarella individual",
        "descripcion": "Ternera empanada con pure de papa",
        "cantidad": 0,
        "pedido": false
      },
      {
        "id": 5,
        "nombre": "Filez de merluza con pure",
        "descripcion": "Merluza empanada con pure de papa",
        "cantidad": 0,
        "pedido": false
      },
      {
        "id": 6,
        "nombre": "Ravioles",
        "descripcion": "Ternera empanada con pure de papa",
        "cantidad": 0,
        "pedido": true
      },
      {
        "id": 7,
        "nombre": "Milanesas con pure",
        "descripcion": "Ternera empanada con pure de papa",
        "cantidad": 0,
        "pedido": false
      },
      {
        "id": 8,
        "nombre": "Milanesas con pure",
        "descripcion": "Ternera empanada con pure de papa",
        "cantidad": 0,
        "pedido": true
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaPedidoPage');
  }

  seleccionarPedido(item: any, cantidad: any) {
    console.log('Seleccionado ');
    console.log(item.pedido);
    console.log('Cantidad ');
    console.log(cantidad);

  }



}
