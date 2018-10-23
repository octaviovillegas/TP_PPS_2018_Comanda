import { MenuComponent } from './../components/menu/menu';
import { EncuestaEnstradaSalidaPage } from '../pages/encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida';
import { EncuestaSupervisorPage } from '../pages/encuestasPages/encuesta-supervisor/encuesta-supervisor';
import { AltaPedidoPage } from './../pages/pedidosPages/alta-pedido/alta-pedido';
import { AltaClientePage } from '../pages/altasPages/alta-cliente/alta-cliente';
import { MenuMozoPage } from './../pages/menusPages/menu-mozo/menu-mozo';
import { PedidosPage } from '../pages/pedidosPages/pedidos/pedidos';
import { MesasPage } from './../pages/mesasPages/mesas/mesas';



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
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
// CAMERA
import { Camera } from '@ionic-native/camera';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ChartModule } from 'primeng/chart';

//import { ImgPreloadDirective } from '../directives/img-preload/img-preload';
import { IonicImageLoader } from 'ionic-image-loader';
import { NativeAudio } from '@ionic-native/native-audio';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ComponentsModule } from '../components/components.module';


export const firebaseConfig = {
  apiKey: "AIzaSyDsDUoXfo8kvkYOm9Q8DzWHF82QVGltwo4",
  authDomain: "equipo3-74752.firebaseapp.com",
  databaseURL: "https://equipo3-74752.firebaseio.com",
  projectId: 'equipo3-74752',
  storageBucket: "equipo3-74752.appspot.com",
  messagingSenderId: "418317265409",
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
    ModalPage,
    MesasPage,
    PedidosPage,
    AltaPedidoPage,
    AltaClientePage,
    EncuestaEnstradaSalidaPage,
    EncuestaSupervisorPage,
    MenuMozoPage
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
    ChartModule,
    ComponentsModule
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SplashPage,
    LindasPage,
    FeasPage,
    ModalPage,
    MesasPage,
    PedidosPage,
    AltaPedidoPage,
    AltaClientePage,
    EncuestaEnstradaSalidaPage,
    EncuestaSupervisorPage,
    MenuMozoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFireDatabase,
    AngularFirestore,
    Camera,
    DeviceMotion,
    NativeAudio,
    ScreenOrientation


  ]
})
export class AppModule { }
