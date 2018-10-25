import { MesasPage } from './../pages/mesasPages/mesas/mesas';
import { AltaClientePage } from './../pages/altasPages/alta-cliente/alta-cliente';
import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Platform, Nav } from 'ionic-angular';
import { SplashPage } from '../pages/splash/splash';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = SplashPage;
  rootPage: any = AltaClientePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public screen: ScreenOrientation) {
    platform.ready().then(() => {


      console.log('1. APP COMPONENT');
      if (platform.is('cordova')) {
        this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT)
          .then(() => { });
      }

      console.log('2. APP COMPONENT');
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  abrirPage(page: any) {
    console.log("appcomponente ABRIRPAGE()");
    console.log(page);
    this.nav.setRoot(page);
  }
}

