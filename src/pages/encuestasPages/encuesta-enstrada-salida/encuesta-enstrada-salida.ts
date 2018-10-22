import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EncuestaEnstradaSalidaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-encuesta-enstrada-salida',
  templateUrl: 'encuesta-enstrada-salida.html',
})
export class EncuestaEnstradaSalidaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("ENCUESTA E-S");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaEnstradaSalidaPage');
  }

}
