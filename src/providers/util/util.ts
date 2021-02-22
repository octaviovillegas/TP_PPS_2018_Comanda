import { HttpClient } from "@angular/common/http";
import { Injectable, ViewChild } from "@angular/core";
import { LoginPage } from '../../pages/login/login';
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
    return temp;
  }



  // cargadoError = this.esperar(this.creaFondo("Error, codigo no identificado", "assets/imgs/error.png"));
  // cargadoError.present();

  public presentLoading(mensaje: string) {
    this.ldg = this.loadingCtrl.create({
      spinner: "dots",
      content: mensaje
    });
    this.ldg.present();
  }



  public esperar(personalizado?: string) {

    if (!personalizado) {
      this.ldg = this.loadingCtrl.create({
        content: 'Por favor, espere...'
      });
    }
    else {
      this.ldg = this.loadingCtrl.create({
        spinner: 'hide',
        content: personalizado,
      })
    }
    this.ldg.present();
  }

  public creaFondo(mensaje, imagen) {
    let fondo = `
          <div>
            <ion-row>
              <ion-col>
                <div style:'height:50% !important;'>
                  <img src="${imagen}">
                </div>
              </ion-col>
            </ion-row>
            <ion-row>
              <h3> ${mensaje} </h3>
            </ion-row> 
          </div> `;
    return fondo;
  }
}
