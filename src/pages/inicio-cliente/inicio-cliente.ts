import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ReservaClientePage} from '../reservas/reserva-cliente/reserva-cliente';
import {QrEsperaPage} from '../qr/qr-espera/qr-espera';
import {LoginPage} from '../../pages/login/login';
/**
 * Generated class for the InicioClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inicio-cliente',
  templateUrl: 'inicio-cliente.html',
})
export class InicioClientePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioClientePage');
  }
  public reservas(){
    this.navCtrl.push(ReservaClientePage);
  }
  
  public qrEspera(){
    this.navCtrl.push(QrEsperaPage);
  }
  public salir(){
    localStorage.removeItem('userID');
    localStorage.removeItem('perfil');
    this.navCtrl.setRoot(LoginPage);
  }


}
