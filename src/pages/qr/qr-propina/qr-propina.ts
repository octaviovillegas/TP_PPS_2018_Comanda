import { ComandaProvider } from './../../../providers/comanda/comanda';
import { LoginPage } from './../../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MesasPage } from '../../mesasPages/mesas/mesas';
import { IComanda } from '../../../clases/IComanda';
import { EncuestaClientePage } from '../../encuestasPages/encuesta-cliente/encuesta-cliente';

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

  codigo: string;
  mesa: number;
  mesaKey: string;
  comanda: IComanda;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public scanner: BarcodeScanner,
    public loadingCtrl: LoadingController,
    public _comandas: ComandaProvider
  ) {
    this.codigo = "";
    this.mesa = parseInt(this.navParams.get("mesa"));
    this.mesaKey = this.navParams.get("mesaKey");
    this.comanda = this.navParams.get("comanda");

    console.log(this.mesa);
    console.log(this.mesaKey);
    console.log(this.comanda);


  }

  escanear() {
    this.scanner.scan()
      .then(barcodeData => {
        this.codigo = barcodeData.text;
        this.cargarCodigo();
      })
  }

  public cargarCodigo() {
    switch (this.codigo) {

      case '20porciento':
        let loading20 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading20.present();

        this.comanda.porcentajePropina = 20;
        this._comandas.guardarPropina(this.comanda)
          .then(() => {
            setTimeout(() => {
              loading20.dismiss().then(() => {
                let cargado20 = this.esperar(this.creaFondo('"Dejaste 20% de propina ¡GRACIAS!"', "assets/imgs/icono_restaurant.png"));
                cargado20.present();
                setTimeout(() => {
                  cargado20.dismiss().then(() => { this.navCtrl.setRoot(EncuestaClientePage); })
                }, 2000);
              })
            }, 4000);
          });
        break;

      case '15porciento':
        let loading15 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading15.present();

        this.comanda.porcentajePropina = 15;
        this._comandas.guardarPropina(this.comanda)
          .then(() => {
            setTimeout(() => {
              loading15.dismiss().then(() => {
                let cargado15 = this.esperar(this.creaFondo('"Dejaste 15% de propina ¡GRACIAS!"', "assets/imgs/icono_restaurant.png"));
                cargado15.present();
                setTimeout(() => {
                  cargado15.dismiss().then(() => { this.navCtrl.setRoot(EncuestaClientePage); })
                }, 2000);
              })
            }, 4000);
          });
        break;

      case '10porciento':
        let loading10 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading10.present();

        this.comanda.porcentajePropina = 10;
        this._comandas.guardarPropina(this.comanda)
          .then(() => {
            setTimeout(() => {
              loading10.dismiss().then(() => {
                let cargado10 = this.esperar(this.creaFondo('"Dejaste 10% de propina ¡GRACIAS!"', "assets/imgs/icono_restaurant.png"));
                cargado10.present();
                setTimeout(() => {
                  cargado10.dismiss().then(() => { this.navCtrl.setRoot(EncuestaClientePage); })
                }, 2000);
              })
            }, 4000);
          });
        break;

      case '5porciento':
        let loading5 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading5.present();

        this.comanda.porcentajePropina = 5;
        this._comandas.guardarPropina(this.comanda)
          .then(() => {
            setTimeout(() => {
              loading5.dismiss().then(() => {
                let cargado5 = this.esperar(this.creaFondo('"Dejaste 5% de propina ¡GRACIAS!"', "assets/imgs/icono_restaurant.png"));
                cargado5.present();
                setTimeout(() => {
                  cargado5.dismiss().then(() => { this.navCtrl.setRoot(EncuestaClientePage); })
                }, 2000);
              })
            }, 4000);
          });
        break;

      case '0porciento':
        let loading0 = this.loadingCtrl.create({
          content: 'Por favor espere...'
        })
        loading0.present();

        this.comanda.porcentajePropina = 0;
        this._comandas.guardarPropina(this.comanda)
          .then(() => {
            setTimeout(() => {
              loading0.dismiss().then(() => {
                let cargado0 = this.esperar(this.creaFondo('"Dejaste 0% de propina"', "assets/imgs/icono_restaurant.png"));
                cargado0.present();
                setTimeout(() => {
                  cargado0.dismiss().then(() => {
                    this.navCtrl.setRoot(EncuestaClientePage);
                  })
                }, 2000);
              })
            }, 4000);
          });
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
          }, 2000);
        }, 4000);
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
