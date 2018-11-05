import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { App, LoadingController, Loading, ToastController } from 'ionic-angular';
import { AuthProvider } from './../auth/auth';


@Injectable()
export class UtilProvider {

  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public app: App,
    private authProvider: AuthProvider,
    public toastCtrl: ToastController) {
    console.log('Hello UtilProvider Provider');

  }

  public ldg: Loading = null;

  presentLoading(mensaje: string) {
    this.ldg = this.loadingCtrl.create({
      spinner: 'dots',
      content: mensaje
    });
    this.ldg.present();
  }

  dismiss() {
    return this.ldg.dismiss();
  }

  volverRoot() {
    this.app.getRootNav().setRoot(this.authProvider.buscarDestino(localStorage.getItem("perfil")));
  }

  mostrarMensaje(mensaje: string) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    }).present();
  }

}
