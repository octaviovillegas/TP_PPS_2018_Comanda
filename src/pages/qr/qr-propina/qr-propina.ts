import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MesasPage } from '../../mesasPages/mesas/mesas';

/**
 * Generated class for the QrPropinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-propina',
  templateUrl: 'qr-propina.html',
})
export class QrPropinaPage {
  codigo:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public scanner:BarcodeScanner,
    public loadingCtrl:LoadingController) 
  {
    this.codigo = "";
  }

  escanear(){
    this.scanner.scan()
    .then(barcodeData =>{
      this.codigo = barcodeData.text;
      this.cargarCodigo();
    })  
  }
  public cargarCodigo(){
    switch (this.codigo) {
      case 'njbnkjjkvzkxcvnjkxzcvnjzxcv':
        let loading20 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading20.present();
        setTimeout(() => {
          loading20.dismiss();
          this.codigo = "a" + this.codigo + "a";
          let cargado20 = this.esperar(this.creaFondo(this.codigo, "assets/imgs/icono_restaurant.png"));
          cargado20.present();
          setTimeout(() => {
            cargado20.dismiss();
            this.navCtrl.push(MesasPage);
          }, 20000);
        }, 7000);
        break;
      case 'sdfsafsdfasdfasdfavxcvb':
        let loading15 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading15.present();
        setTimeout(() => {
          loading15.dismiss();
          let cargado15 = this.esperar(this.creaFondo("Se dejo 15% de propina", "assets/imgs/icono_restaurant.png"));
          cargado15.present();
          setTimeout(() => {
            cargado15.dismiss();
            this.navCtrl.setRoot(MesasPage);
          }, 3000);
        }, 7000);
        break;
      case 'sionfgbiobiuasdiasgdfgs':
        let loading10 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading10.present();
        setTimeout(() => {
          loading10.dismiss();
          let cargado10 = this.esperar(this.creaFondo("Se dejo 10% de propina", "assets/imgs/icono_restaurant.png"));
          cargado10.present();
          setTimeout(() => {
            cargado10.dismiss();
            this.navCtrl.setRoot(MesasPage);
          }, 3000);
        }, 7000);
        break;
      case 'mbkclvmbdnfgidfngjdifid':
        let loading5 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading5.present();
        setTimeout(() => {
          loading5.dismiss();
          let cargado5 = this.esperar(this.creaFondo("Se dejo 5% de propina", "assets/imgs/icono_restaurant.png"));
          cargado5.present();
          setTimeout(() => {
            cargado5.dismiss();
            this.navCtrl.setRoot(MesasPage);
          }, 3000);
        }, 7000);
        break;
      case 'poipuoiyuituyryetvhvcctft':
        let loading0 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading0.present();
        setTimeout(() => {
          loading0.dismiss();
          let cargado0 = this.esperar(this.creaFondo("Se dejo 0% de propina", "assets/imgs/icono_restaurant.png"));
          cargado0.present();
          setTimeout(() => {
            cargado0.dismiss();
            this.navCtrl.setRoot(MesasPage);
          }, 3000);
        }, 7000);
        break;
      default:
        let error = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        error.present();
        setTimeout(() => {
          error.dismiss();
          
          let cargadoError = this.esperar(this.creaFondo("Error, codigo no identificado", "assets/imgs/error.png"));
          cargadoError.present();
          setTimeout(() => {
            cargadoError.dismiss();
            this.navCtrl.setRoot(MesasPage);
          }, 20000);
        }, 7000);
        break;
    }
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
              <ion-col>
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
