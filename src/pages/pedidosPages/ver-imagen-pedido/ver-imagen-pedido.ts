import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-ver-imagen-pedido',
  templateUrl: 'ver-imagen-pedido.html',
})
export class VerImagenPedidoPage {

  ldg: Loading = null;
  imagen:string;
  titulo:string;
  votos:string;

  constructor(    
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController) {
      this.presentLoading("Cargando imagen...");
  }

  ionViewDidLoad() {
   
  }

  presentLoading(mensaje: string) {
    this.ldg = this.loadingCtrl.create({
      spinner: 'dots',
      content: mensaje
    });

    this.ldg.present();
  }
}
