// import { AltaPedidoPage } from './../pages/pedidosPages/alta-pedido/alta-pedido';
// import { MesasPage } from './../pages/mesasPages/mesas/mesas';
import { Component, ViewChild } from "@angular/core";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Platform, Nav, MenuController } from "ionic-angular";
// import { SplashPage } from '../pages/splash/splash';
// import { AltaPlatoPage } from "../pages/altasPages/alta-plato/alta-plato";
// import { ScreenOrientation } from "@ionic-native/screen-orientation";
// import { LoginPage } from "../pages/login/login";
// import { AuthProvider } from "../providers/auth/auth";
// import { AltaBebidaPage } from "../pages/altasPages/alta-bebida/alta-bebida";
// import { AltaSupervisorPage } from "../pages/altasPages/alta-supervisor/alta-supervisor";
import { QrPropinaPage } from "../pages/qr/qr-propina/qr-propina";
import { EncuestaSupervisorPage } from "../pages/encuestasPages/encuesta-supervisor/encuesta-supervisor";
import { AltaClienteAnonimoPage } from "../pages/altasPages/alta-cliente-anonimo/alta-cliente-anonimo";
 import { AltaPlatoPage } from '../pages/altasPages/alta-plato/alta-plato';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LoginPage } from '../pages/login/login';
import {EsperaPage} from '../pages/espera/espera';
import { QrEsperaPage } from '../pages/qr/qr-espera/qr-espera';
import { AuthProvider } from '../providers/auth/auth';
import { AltaBebidaPage } from '../pages/altasPages/alta-bebida/alta-bebida';
import { AltaSupervisorPage } from '../pages/altasPages/alta-supervisor/alta-supervisor';
// import { EncuestaEnstradaSalidaPage } from '../pages/encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida';

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  //rootPage: any = SplashPage;
  //rootPage: any = LoginPage;
  //rootPage: any = LoginPage;
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public screen: ScreenOrientation,
    private auth: AuthProvider,
    private menuCtrl: MenuController
  ) {
    platform.ready().then(() => {
      if (platform.is("cordova")) {
        this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT).then(() => {
          //Tiene que ir fuera de este IF para que funcione en la web
          //this.session();
        });
      }

      this.session();

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  session() {
    this.auth.Session.subscribe(_session => {

      if (!_session) { //si no esta logueado
        this.rootPage = LoginPage;
      }else {
        if(localStorage.getItem("perfil") == null){
          this.rootPage = LoginPage;
        }else{
          this.rootPage = this.auth.buscarDestino(localStorage.getItem("perfil"));
        }
      }
    });
  }

  abrirPage(page: any) {
    this.nav.setRoot(page);
  }

  salir(page: any) {
    localStorage.removeItem("perfil");
    localStorage.removeItem("usuario");
    this.auth.logout();
    this.nav.setRoot(page);
  }
}
