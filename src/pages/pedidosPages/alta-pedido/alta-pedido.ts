
import { AngularFireList } from 'angularfire2/database';
import { VerImagenPedidoPage } from './../ver-imagen-pedido/ver-imagen-pedido';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, List } from 'ionic-angular';
import { Observable } from '@firebase/util';
import { bebidasProvider } from '../../../providers/bebidas/bebidas';
import { platosProvider } from '../../../providers/platos/plato';
import { IPlato } from './../../../clases/IPlato';
import { NgSwitch } from '@angular/common';
import { IPedido } from '../../../clases/IPedido';
import { asTextData } from '@angular/core/src/view';
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

  public menu = [];
  public lCalientes: IPedido[] = [];
  public lFrios: IPedido[] = [];
  public lMinutas: IPedido[] = [];
  public lPostres: IPedido[] = [];
  public lBebidas: IPedido[] = [];

  public mesa: any;
  public tipomenu: any;
  public pedido: Array<IPedido>;
  cant: number;
  public platos: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popCtrl: PopoverController,
    public _platosProvider: platosProvider,
    public _bebidasProvider: bebidasProvider) {

    this.traerMenuPorCategoria('Minutas');
    this.mesa = this.navParams.get("mesa");
    this.tipomenu = "minutas";
    this.pedido = [];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaPedidoPage');
  }


  cargarPedido(item: IPlato): IPedido {
    let pedido: IPedido = {
      nombre: item.nombre,
      id: item.id,
      tiempoEstimado: item.tiempoEstimado,
      importe: item.importe,
      categoria: item.categoria,
      descripcion: item.descripcion,
      ingredientesFoto: item.ingredientesFoto,
      preparacionFoto: item.preparacionFoto,
      preparadoFoto: item.preparadoFoto,
      idPedido: 0,
      cantidad: 0
    }

    return pedido;
  }


  existeMenu(categoria: string): boolean {
    switch (categoria) {
      case 'Minutas':
        if (this.lMinutas.length > 0) { return true; }
        break;

      case 'Calientes':
        if (this.lCalientes.length > 0) { return true; }
        break;

      case 'Frios':
        if (this.lFrios.length > 0) { return true; }
        break;

      case 'Postres':
        if (this.lPostres.length > 0) { return true; }
        break;

      case 'Bebidas':
        if (this.lBebidas.length > 0) { return true; }
        break;
    }

    return false;
  }

  traerMenuPorCategoria(categoria: string) {

    console.log('CATEGORIA1');
    console.log(categoria);
    console.log(this.existeMenu(categoria));
    if (!(this.existeMenu(categoria))) {
      this._platosProvider.traerPlatos(categoria).subscribe(dataPlatos => {

        console.log(dataPlatos);

        switch (categoria) {
          case 'Minutas':
            dataPlatos.forEach((item: IPlato) => {
              this.lMinutas.push(this.cargarPedido(item));
            });
            break;
          case 'Calientes':
            dataPlatos.forEach((item: IPlato) => {
              this.lCalientes.push(this.cargarPedido(item));
            });
            break;
          case 'Frios':
            dataPlatos.forEach((item: IPlato) => {
              this.lFrios.push(this.cargarPedido(item));
            });
            break;
          case 'Postres':
            dataPlatos.forEach((item: IPlato) => {
              this.lPostres.push(this.cargarPedido(item));
            });
            break;
          // case 'Bebidas':
          //   dataPlatos.forEach((item: IPlato) => {
          //     this.lBebidas.push(this.cargarPedido(item));
          //   });
          //   break;
        }
      });
    }
  }


  traerMenuBebidas() {
    if (!this.existeMenu('Bebidas')) {
      this._bebidasProvider.traerBebidas().subscribe(dataBebidas => {
        dataBebidas.forEach((item: IPlato) => {
          this.lBebidas.push(this.cargarPedido(item));
        });
        console.log(dataBebidas);
      });
    }
  }

  seleccionarPedido(item: any, value: number) {

    // if (this.pedido.some(p => p.id === item.id)) {
    //   for (var i = 0; i < this.pedido.length; i++) {
    //     if (this.pedido[i].id === item.id) {
    //       this.pedido[i].cantidad += value;
    //       if (this.pedido[i].cantidad == 0) {
    //         this.pedido.splice(i, 1);
    //       }
    //       break;
    //     }
    //   }
    // }
    // else {
    //   this.pedido.push({
    //     "id": item.id,
    //     "nombre:": item.nombre,
    //     "descripcion": item.descripcion,
    //     "cantidad": 1
    //   })
    // }
    // console.log(this.pedido);
  }

  sumarCantidad(item: IPedido, value: number) {
      item.cantidad = item.cantidad + value;
    
  }
  restarCantidad(item: IPedido, value: number) {
    if (item.cantidad > 0) {
      item.cantidad = item.cantidad + value;
    }
  }

  mostrarImagenes() {
    // const popover = this.popCtrl.create(VerImagenPedidoPage, { imagen: img, titulo: tit, votos: votos });
    // popover.present();
  }

  getItems(ev: any) {
    this.inicializarItemsMenu();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.lCalientes = this.lCalientes.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  inicializarItemsMenu() {
    // this.menu = [
    //   {
    //     "id": 1,
    //     "nombre": "Milanesas con pure",
    //     "descripcion": "Ternera rebozada con pure de papa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 2,
    //     "nombre": "Suprema con papas",
    //     "descripcion": "Pechuga de pollo rebozada con papas fritas",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 3,
    //     "nombre": "Ensalada cesar",
    //     "descripcion": "Ensalada de lechuga, pollo con salsa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 4,
    //     "nombre": "Mozzarella individual",
    //     "descripcion": "Ternera empanada con pure de papa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 5,
    //     "nombre": "Filet de merluza con pure",
    //     "descripcion": "Merluza empanada con pure de papa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 6,
    //     "nombre": "Ravioles",
    //     "descripcion": "Ternera empanada con pure de papa",
    //     "precio": 20,
    //     "categoria": 1
    //   },
    //   {
    //     "id": 7,
    //     "nombre": "Coca Cola",
    //     "descripcion": "Cocacola 330 ml",
    //     "precio": 20,
    //     "categoria": 3
    //   },
    //   {
    //     "id": 8,
    //     "nombre": "Pepsi",
    //     "descripcion": "Pepsi 330ml",
    //     "precio": 20,
    //     "categoria": 3
    //   },
    //   {
    //     "id": 9,
    //     "nombre": "Vitel tone",
    //     "descripcion": "Peceto con salsa de atun",
    //     "precio": 20,
    //     "categoria": 2
    //   },
    //   {
    //     "id": 10,
    //     "nombre": "Ensalada rusa",
    //     "descripcion": "Zanahoria, Papa y arvejas con mayonesa",
    //     "precio": 20,
    //     "categoria": 2
    //   }
    // ];
  }

  agregarPedido() {

  }

}
