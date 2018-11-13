import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {EsperaProvider} from '../../../providers/espera/espera';
import { Observable } from 'rxjs';
import {IEspera} from '../../../clases/IEspera';
import {MesasPage} from '../../mesasPages/mesas/mesas';
import {AuthProvider} from '../../../providers/auth/auth';
import { LoginPage } from '../../login/login';

/**
 * Generated class for the QrEsperaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-espera',
  templateUrl: 'qr-espera.html',
})
export class QrEsperaPage {
  esperaForm:FormGroup;
  clienteUid:string;
  cantidad:string;
  escaneado:boolean;
  codigo:string;
  esperando:boolean;
  espera:Observable<IEspera[]>;
  uidEspera:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public scanner:BarcodeScanner,
    public loadingCtrl: LoadingController,
    public proveedorEsperar:EsperaProvider,
    public auth: AuthProvider) 
  {
    this.esperaForm = this.formBuilder.group({
      cantidad: ['', Validators.required]
    })
    this.escaneado = false;
    this.esperando = false;
    this.clienteUid = localStorage.getItem("userID");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrEsperaPage');
  }

  escanear(){
    this.scanner.scan()
    .then(barcodeData =>{
      this.codigo = barcodeData.text;
      this.escaneado = true;
      let correcto = this.esperar(this.creaFondo("¡Escaneo correcto!", "assets/imgs/icono_restaurant.png"));
      correcto.present();
      setTimeout(() => {
        correcto.dismiss();
      }, 2500);
    })  
  }

  public cargarCodigo(){
    let cargando = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    cargando.present();

    if(this.codigo == 'ponerse'){
      setTimeout(() => {
        cargando.dismiss();
      }, 3000);
      this.escaneado = true;
        this.proveedorEsperar.ponerseEnLista(this.clienteUid, this.esperaForm.controls['cantidad'].value)
        .then(data =>{
          this.espera = this.proveedorEsperar.traerEnLista();
          
          this.esperando = true;
          this.espera.subscribe(esperas =>{
            esperas.forEach(element => {
              if(element.uidCliente == this.clienteUid){
                this.uidEspera = element.key;
              }
              if(element.uidCliente == this.clienteUid  && element.estado == 'asignado'){
                this.navCtrl.setRoot(MesasPage);
              }
            });
          })
        })
    }
    else{
      setTimeout(() => {
        cargando.dismiss();
      }, 3000);

      let incorrecto = this.esperar(this.creaFondo("¡Codigo incorrecto!", "assets/imgs/error.png"));
      incorrecto.present();
      setTimeout(() => {
        incorrecto.dismiss();
      }, 4000);
    }
  }



  public salir(){
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuario');
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
    
  }
  public salirEspera(){
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuario');
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
    this.proveedorEsperar.salirLista(this.uidEspera);
  }



  esperar(personalizado?: string): Loading {
    let loading;
    if (!personalizado) {
      loading = this.loadingCtrl.create({

        content: 'Por favor, espere...'
      });
    }
    else {
      loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: personalizado,
      })
    }
    return loading;
  }
  creaFondo(mensaje, imagen) {
    let fondo = `
          <div>
            <ion-row>
              <ion-col text-center>
                <img src="${imagen}">
              </ion-col>
            </ion-row>
            <ion-row>
              <h1> ${mensaje} </h1>
            </ion-row> 
          </div> `;
    return fondo;

  }


}
