import { Subscription } from 'rxjs';
import { UtilProvider } from './../providers/util/util';
import { IComanda } from './../clases/IComanda';
import { ComandaProvider } from './../providers/comanda/comanda';
import { IMensaje } from './../clases/IMensaje';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PushProvider } from './../providers/push/push';
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
// import { QrPropinaPage } from "../pages/qr/qr-propina/qr-propina";
// import { EncuestaSupervisorPage } from "../pages/encuestasPages/encuesta-supervisor/encuesta-supervisor";
// import { AltaClienteAnonimoPage } from "../pages/altasPages/alta-cliente-anonimo/alta-cliente-anonimo";
// import { AltaPlatoPage } from '../pages/altasPages/alta-plato/alta-plato';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LoginPage } from '../pages/login/login';
// import { EsperaPage } from '../pages/espera/espera';
// import { QrEsperaPage } from '../pages/qr/qr-espera/qr-espera';
import { AuthProvider } from '../providers/auth/auth';
// import { AltaBebidaPage } from '../pages/altasPages/alta-bebida/alta-bebida';
// import { AltaSupervisorPage } from '../pages/altasPages/alta-supervisor/alta-supervisor';
import { PedidosPage } from "../pages/pedidosPages/pedidos/pedidos";
import { TipoPush } from '../clases/EnumTipoPush';
// import {AltaPedidoPage} from "../pages/pedidosPages/alta-pedido/alta-pedido";
// import {TraspasoPedidoPage} from '../pages/qr/qr-espera/traspaso-pedido/traspaso-pedido';
// import {SplashPage} from '../pages/splash/splash';
// import {AltaEmpleadoPage} from '../pages/altasPages/alta-empleado/alta-empleado';
// import {FotoClientePage} from '../pages/altasPages/alta-cliente/foto-cliente/foto-cliente';
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
  subs: Subscription;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public screen: ScreenOrientation,
    private auth: AuthProvider,
    private menuCtrl: MenuController,
    private _push: PushProvider,
    public localNoti: LocalNotifications,
    public _comanda: ComandaProvider,
    public utilProvider: UtilProvider
  ) {
    platform.ready().then(() => {
      if (platform.is("cordova")) {
        this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT).then(() => {
          //Tiene que ir fuera de este IF para que funcione en la web
          //this.session();
        });

        this.esperarPush();
        //_push.escucharMensajes();
      }

      this.session();

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  esperarPush() {
    this.subs = this.localNoti.on("schedule").subscribe((noti) => {

      //this.utilProvider.mostrarMensaje("ESPERAR PUSH");
      //Tomo la decision de que hacer con la notificacion dependiendo del tipo
      this.ejecutarPush(noti);
    });
  }


  ejecutarPush(notificacion: any) {
    let push: IMensaje = notificacion.data as IMensaje;


    switch (notificacion.tipoMensaje) {
      case TipoPush.PEDIR_CUENTA:
        this.pedirCuenta(push);
        break;
    }
  }

  pedirCuenta(sms: IMensaje) {
    let mesa = sms.data.mesa;
    let mesaKey = sms.data.mesaKey;
    let comandaID = sms.data.comanda;

    //this.utilProvider.mostrarMensaje("PEDIR CUENTA");
    this._comanda.verificarComandaPorUsuario(comandaID).then((comanda: IComanda) => {

      //this.utilProvider.mostrarMensaje("ENTRA A VERIFICAR");
      //La comanda le pertenece al usuario
      if (comanda != null) {
        this.nav.setRoot(PedidosPage, { mesa: mesa, mesaKey: mesaKey, comanda: comanda });
      } else {
        this.utilProvider.mostrarMensaje("La comanda es de otro Mozo");
      }

    }, () => { return false; });


  }


  session() {
    this.auth.Session.subscribe(_session => {

      if (!_session) { //si no esta logueado
        this.rootPage = LoginPage;
      } else {

        ////////////////PUSH/////////////////////////
        this._push.escucharMensajes(localStorage.getItem("userID"));
        ////////////////PUSH/////////////////////////


        if (localStorage.getItem("perfil") == null) {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = this.auth.buscarDestino(localStorage.getItem("perfil"));
        }
      }
    });
  }

  abrirPage(page: any) {
    this.nav.setRoot(page);
  }

  salir(page: any) {

    if(!this.subs.closed)
      this.subs.unsubscribe();

    if(!this._push.subs.closed)
      this._push.subs.unsubscribe();
    
    localStorage.removeItem("perfil");
    localStorage.removeItem("usuario");
    localStorage.removeItem("userID");
    this.auth.logout();
    this.nav.setRoot(page);
  }
}
