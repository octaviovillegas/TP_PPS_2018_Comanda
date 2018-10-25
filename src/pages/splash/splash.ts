import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AltaClientePage } from '../altasPages/alta-cliente/alta-cliente';
import { NativeAudio } from '@ionic-native/native-audio';
/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public audioNativo: NativeAudio) {

    if (this.platform.is('cordova')) {
      this.audioNativo.preloadSimple('intro', 'assets/sonidos/intro.mp3')
        .then(() => {
        });
    }
  }

  ionViewDidLoad() {
    if (this.platform.is('cordova')) {

      setTimeout(() => {
        this.audioNativo.play('intro')
          .then(() => {
            setTimeout(() => {
              this.navCtrl.push(AltaClientePage)
            }, 7000);
          })
      }, 2000);
    }
    else {
      setTimeout(() => {
        this.navCtrl.push(AltaClientePage)
      }, 7000);
    }

  }

}
