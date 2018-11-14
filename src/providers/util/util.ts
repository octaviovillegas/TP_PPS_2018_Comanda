import { HttpClient } from "@angular/common/http";
import { Injectable, ViewChild } from "@angular/core";
import {LoginPage} from '../../pages/login/login';
import {
  App,
  LoadingController,
  Loading,
  ToastController
} from "ionic-angular";
import { AuthProvider } from "./../auth/auth";

@Injectable()
export class UtilProvider {
  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public app: App,
    private authProvider: AuthProvider,
    public toastCtrl: ToastController
  ) {
    //console.log("Hello UtilProvider Provider");
  }

  public ldg: Loading = null;

  presentLoading(mensaje: string) {
    this.ldg = this.loadingCtrl.create({
      spinner: "dots",
      content: mensaje
    });
    this.ldg.present();
  }

  dismiss() {
    return this.ldg.dismiss();
  }

  volverRoot() {
    this.app
      .getRootNav()
      .setRoot(this.authProvider.buscarDestino(localStorage.getItem("perfil")));
  }

  mostrarMensaje(mensaje: string) {
    this.toastCtrl
      .create({
        message: mensaje,
        duration: 2000,
        position: "bottom"
      })
      .present();
  }

  convertirAHora(milisegundos: number): string {
    var time = new Date(milisegundos);
    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    var temp = "" + (hour > 12 ? hour - 12 : hour);
    if (hour == 0) temp = "12";
    temp += (minute < 10 ? ":0" : ":") + minute;
    // temp += (second < 10 ? ":0" : ":") + second;
    // temp += hour >= 12 ? " P.M." : " A.M.";
    //console.log(temp);
    return temp;
  }
}
