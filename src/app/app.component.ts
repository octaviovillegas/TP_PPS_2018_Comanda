import { MesasPage } from './../pages/mesas/mesas';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SplashPage } from '../pages/splash/splash';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SplashPage;
  //rootPage: any = MesasPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public screen: ScreenOrientation) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.



      this.screen.lock(this.screen.ORIENTATIONS.PORTRAIT)
        .then(() => { });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

