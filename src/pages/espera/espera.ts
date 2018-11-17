import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController,MenuController } from 'ionic-angular';
import {EsperaProvider} from '../../providers/espera/espera';
import {IEspera} from '../../clases/IEspera';
import {ModalEsperaPage} from '../espera/modal-espera/modal-espera';
import {Observable} from 'rxjs';
import { EncuestaEnstradaSalidaPageModule } from '../encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida.module';
import { Iusuario, usuario} from '../../clases/usuario';
import {UsuariosProvider} from '../../providers/usuarios/usuarios';
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
  public usuarios:Iusuario[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public proveedorEspera:EsperaProvider,
    public proveedorUsuario:UsuariosProvider,
    public modalCtrl:ModalController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController) 
  {
    this.menuCtrl.enable(true, "menu");
    this.lista = [];
    this.buscarListaEspera();

    this.proveedorUsuario.obtenerUsuarios().subscribe(data =>{
      this.usuarios = data;
    })
  }



  ngOnInit() {
    //this.lista = this.proveedorEspera.traerEnLista();
  }
  public asignarMesa(espera:IEspera){
    let nombre = "";
    let dni = "";
    if(!espera.esAnonimo){
      nombre = espera.nombre;
      dni = espera.dni;
    }
    let miModal = this.modalCtrl.create(ModalEsperaPage,{
      comensales:espera.comensales,
      idCliente:espera.uidCliente,
      idEspera:espera.key,
      esAnonimo: espera.esAnonimo,
      nombre: nombre,
      dni: dni
    });
    miModal.onDidDismiss(data =>{
      let loading = this.loadingCtrl.create({
        spinner:'hide',
        content:`<ion-grid>
                    <ion-row>
                       <ion-col>
                          <img src="assets/imgs/icono_restaurant.png" class="esperando">
                       </ion-col>
                    </ion-row>
                  </ion-grid>
                `,
        cssClass: 'my-loading-class'
      });      

      if(data != null){
        if(data.comanda == "True"){
          loading.present();

          this.proveedorEspera.asignarMesa(espera.key)
          .then(data =>{
            this.buscarListaEspera();
            loading.dismiss();
          })
          .catch(error =>{
            console.log(error);
          })
        }
      }
    })
    miModal.present();
  }

  public buscarListaEspera(){
    this.lista = [];
    this.proveedorEspera.traerEnLista()
    .subscribe(data =>{
      this.lista = [];
      data.forEach(element => {
        if(element.estado == 'espera'){
          this.lista.push(element);
        }
      });
    })
  }
}
