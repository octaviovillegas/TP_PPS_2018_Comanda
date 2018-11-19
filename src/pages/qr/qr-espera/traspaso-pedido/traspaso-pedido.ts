import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ComandaProvider} from '../../../../providers/comanda/comanda';
import {MesasProvider} from '../../../../providers/mesas/mesas';
import {IComanda} from '../../../../clases/IComanda';
import {AltaPedidoPage} from '../../../pedidosPages/alta-pedido/alta-pedido';
import { PedidosPage } from '../../../pedidosPages/pedidos/pedidos';
/**
 * Generated class for the TraspasoPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-traspaso-pedido',
  templateUrl: 'traspaso-pedido.html',
})
export class TraspasoPedidoPage {
  comanda:IComanda;
  nroMesa:string;
  mesaKey:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public proveedorComanda:ComandaProvider,
    public proveedorMesa:MesasProvider) 
    {
      console.log(this.proveedorComanda.buscarComandas());
      this.proveedorComanda.buscarComandas().valueChanges()
      .subscribe(data =>{
        console.log(data);
        data.forEach(element => {
          console.log(data);
          if(element.ClienteId == localStorage.getItem('userID') && element.estado == 'Abierta'){
            this.comanda = element;
            this.proveedorMesa.traerMesasconId()
            .subscribe(data =>{
              data.forEach(mesa => {
                if(this.comanda.mesa == mesa.idMesa){
                  this.nroMesa = mesa.numero.toString();
                  this.mesaKey = mesa.key;
                  this.navCtrl.setRoot(PedidosPage,{
                    mesa:this.nroMesa,
                    comanda:this.comanda,
                    mesaKey: this.mesaKey
                  })
                }
              });
            })
          }
        });
        
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TraspasoPedidoPage');
  }

}
