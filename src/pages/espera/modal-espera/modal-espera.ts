import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MesasProvider} from '../../../providers/mesas/mesas';
import {IMesa} from '../../../clases/IMesa';
import {IComanda} from '../../../clases/IComanda';
/**
 * Generated class for the ModalEsperaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-espera',
  templateUrl: 'modal-espera.html',
})
export class ModalEsperaPage {
  comensales:number;
  idCliente:string;
  mesasLibres:IMesa[] = [];
  nuevaComanda:IComanda;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public proveedorMesas:MesasProvider) 
  {
    this.mesasLibres = [];
    this.comensales = this.navParams.get('comensales');
    this.idCliente = this.navParams.get('idCliente');
    this.nuevaComanda;
    this.proveedorMesas.traerMesasconId().subscribe(data =>{
      data.forEach(element => {
        if(element.estado == 'Libre'  && parseInt(element.capacidad) >= this.comensales){
          this.mesasLibres.push(element);
        }
      });
      console.log(this.mesasLibres);
    })
    this.idCliente = this.navParams.get('idCliente');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEsperaPage');
  }

  public asignar(){
    
  }

}
