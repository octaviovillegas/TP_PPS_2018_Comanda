import { MesasPage } from './../pages/mesasPages/mesas/mesas';
import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { SplashPage } from '../pages/splash/splash';
import { AltaPlatoPage } from '../pages/altasPages/alta-plato/alta-plato';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { EncuestaEnstradaSalidaPage } from '../pages/encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = SplashPage;
  //rootPage: any = LoginPage;
  rootPage: any = EncuestaEnstradaSalidaPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public screen: ScreenOrientation,
    private auth: AuthProvider,
    private menuCtrl: MenuController
    ) {


    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT)
          .then(() => {
            this.session();
          });
      }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


  session() {
    this.auth.Session.subscribe(session => {
      if (!session) {
       // this.rootPage = LoginPage;
      }
      else {

      }
    });
  }

  abrirPage(page: any) {
    console.log(page);
    this.nav.setRoot(page);
   // this.menuCtrl.close();
  }

  salir(page: any) {
    console.log(page);
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuario');
    this.auth.logout();
    this.rootPage = LoginPage;
  }
}

