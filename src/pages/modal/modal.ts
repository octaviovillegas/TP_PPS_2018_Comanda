import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import {cosas} from '../../clases/cosas';
/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  url:string;
  nombre:string;
  usuario:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ModalPage');
  }

  ionViewWillEnter(){
    this.url = this.navParams.get('foto');
    this.nombre = this.navParams.get('nombre');
    this.usuario = this.navParams.get('usuario');
  }
  public cerrar(){
    this.viewCtrl.dismiss();
  }
}
