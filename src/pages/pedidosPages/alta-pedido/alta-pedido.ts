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
    this.pedido = [];



    this.menuFrios = [
    ];

    this.menuPlatos = [
      {
        "id": 1,
        "nombre": "Milanesas con pure",
        "descripcion": "Ternera rebozada con pure de papa",
        "precio": 20,
        "categoria": 1
      },
      {
        "id": 2,
        "nombre": "Suprema con papas",
        "descripcion": "Pechuga de pollo rebozada con papas fritas",
        "precio": 20,
        "categoria": 1
      },
      {
        "id": 3,
        "nombre": "Ensalada cesar",
        "descripcion": "Ensalada de lechuga, pollo con salsa",
        "precio": 20,
        "categoria": 1
      },
      {
        "id": 4,
        "nombre": "Mozzarella individual",
        "descripcion": "Ternera empanada con pure de papa",
        "precio": 20,
        "categoria": 1
      },
      {
        "id": 5,
        "nombre": "Filet de merluza con pure",
        "descripcion": "Merluza empanada con pure de papa",
        "precio": 20,
        "categoria": 1
      },
      {
        "id": 6,
        "nombre": "Ravioles",
        "descripcion": "Ternera empanada con pure de papa",
        "precio": 20,
        "categoria": 1
      },
      {
        "id": 7,
        "nombre": "Coca Cola",
        "descripcion": "Cocacola 330 ml",
        "precio": 20,
        "categoria": 3
      },
      {
        "id": 8,
        "nombre": "Pepsi",
        "descripcion": "Pepsi 330ml",
        "precio": 20,
        "categoria": 3
      },
      {
        "id": 9,
        "nombre": "Vitel tone",
        "descripcion": "Peceto con salsa de atun",
        "precio": 20,
        "categoria": 2
      },
      {
        "id": 10,
        "nombre": "Ensalada rusa",
        "descripcion": "Zanahoria, Papa y arvejas con mayonesa",
        "precio": 20,
        "categoria": 2
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaPedidoPage');
  }

  seleccionarPedido(item: any, value: number) {
  
    if (this.pedido.some(p => p.id === item.id)) {
      for (var i = 0; i < this.pedido.length; i++) {
        if (this.pedido[i].id === item.id) {
          this.pedido[i].cantidad += value;
          if(this.pedido[i].cantidad == 0) {
            this.pedido.splice(i,1);
          }
          break;
        }
      }
    }
    else {
      this.pedido.push({
        "id": item.id,
        "nombre:": item.nombre,
        "descripcion": item.descripcion,
        "cantidad": 1
      })
    }

    console.log(this.pedido);


  }

  agregarPedido() {

  }

}
