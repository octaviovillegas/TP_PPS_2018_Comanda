import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

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
  cantidad:string;
  escaneado:boolean;
  codigo:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public scanner:BarcodeScanner,
    public loadingCtrl: LoadingController) 
  {
    this.esperaForm = this.formBuilder.group({
      cantidad: ['', Validators.required]
    })
    this.escaneado = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrEsperaPage');
  }

  escanear(){
    this.scanner.scan()
    .then(barcodeData =>{
      this.codigo = barcodeData.text;
      this.cargarCodigo();
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
      let correcto = this.esperar(this.creaFondo("¡Escaneo correcto!", "assets/imgs/icono_restaurant.png"));
      correcto.present();
      setTimeout(() => {
        correcto.dismiss();
      }, 4000);
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



  public ponerse(){
    let mensaje = `Buscando mesa para ${this.cantidad}`;
    let puesto = this.esperar(this.creaFondo(mensaje, "assets/imgs/icono_restaurant.png"));
    puesto.present();
    setTimeout(() => {
      puesto.dismiss();
    }, 4000);
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
