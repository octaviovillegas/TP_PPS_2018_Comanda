import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import {EsperaProvider} from '../../providers/espera/espera';
import {IEspera} from '../../clases/IEspera';
import {ModalEsperaPage} from '../espera/modal-espera/modal-espera';
import {Observable} from 'rxjs';
import { EncuestaEnstradaSalidaPageModule } from '../encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida.module';
/**
 * Generated class for the EsperaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-espera',
  templateUrl: 'espera.html',
})
export class EsperaPage {
  //public lista:Observable<IEspera[]>;
  public lista:IEspera[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public proveedorEspera:EsperaProvider,
    public modalCtrl:ModalController) 
  {
    this.lista = [];
    console.log(this.proveedorEspera.traerEnLista());
    this.proveedorEspera.traerEnLista()
    .subscribe(data =>{
      this.lista = data;
    })
  }



  ngOnInit() {
    //this.lista = this.proveedorEspera.traerEnLista();
  }
  public asignarMesa(espera:IEspera){
    let miModal = this.modalCtrl.create(ModalEsperaPage,{
      comensales:espera.comensales,
      idCliente:espera.uidCliente,
    });
    miModal.present();
  }

}
