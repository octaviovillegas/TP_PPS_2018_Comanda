import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Modal } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SplashPage } from '../pages/splash/splash';
import { LindasPage } from '../pages/lindas/lindas';
import { FeasPage } from '../pages/feas/feas';
import { ModalPage } from '../pages/modal/modal';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
//AF

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore,AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
// CAMERA
import { Camera } from '@ionic-native/camera';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import {ChartModule} from 'primeng/chart';

//import { ImgPreloadDirective } from '../directives/img-preload/img-preload';
import { IonicImageLoader } from 'ionic-image-loader';
import {NativeAudio} from '@ionic-native/native-audio';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

export const firebaseConfig = {
  apiKey: "AIzaSyBL7LrUdPL17ifVhMLBA0Rsu0-RLn81hF4",
  authDomain: "logueo-ffa46.firebaseapp.com",
  databaseURL: "https://logueo-ffa46.firebaseio.com",
  projectId: 'logueo-ffa46',
  storageBucket: "logueo-ffa46.appspot.com",
  messagingSenderId: "799164691041",
  automaticDataCollectionEnabled: false
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SplashPage,
    LindasPage,
    FeasPage,
    ModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    HttpClientModule,
    HttpModule,
    IonicImageLoader.forRoot(),
    ChartModule
    

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SplashPage,
    LindasPage,
    FeasPage,
    ModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    AngularFirestore,
    Camera,
    DeviceMotion,
    NativeAudio,
    ScreenOrientation
    
    
  ]
})
export class AppModule {}
