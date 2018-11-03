import { EncuestaEnstradaSalidaPageModule } from '../pages/encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida.module';
import { EncuestaSupervisorPageModule } from '../pages/encuestasPages/encuesta-supervisor/encuesta-supervisor.module';
import { EncuestaClientePageModule } from '../pages/encuestasPages/encuesta-cliente/encuesta-cliente.module';
import { AltaPedidoPageModule } from './../pages/pedidosPages/alta-pedido/alta-pedido.module';
import { AltaClientePageModule } from '../pages/altasPages/alta-cliente/alta-cliente.module';
import { AltaPlatoPageModule } from '../pages/altasPages/alta-plato/alta-plato.module';
import { AltaBebidaPageModule } from '../pages/altasPages/alta-bebida/alta-bebida.module';
import { PedidosPageModule } from '../pages/pedidosPages/pedidos/pedidos.module';
import { MesasPageModule } from './../pages/mesasPages/mesas/mesas.module';
import { AltaSupervisorPageModule } from './../pages/altasPages/alta-supervisor/alta-supervisor.module';
import { AltaDueñoPageModule } from './../pages/altasPages/alta-dueño/alta-dueño.module';
import { VerImagenPedidoPageModule } from '../pages/pedidosPages/ver-imagen-pedido/ver-imagen-pedido.module';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Modal, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SplashPage } from '../pages/splash/splash';
//import { LindasPage } from '../pages/lindas/lindas';
//import { FeasPage } from '../pages/feas/feas';
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
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthProvider } from '../providers/auth/auth';
import { DatosEncuestaProvider } from '../providers/datos/datosEncuesta';
import { platosProvider } from '../providers/platos/plato';
import { bebidasProvider } from '../providers/bebidas/bebidas';
import { UsuariosProvider } from '../providers/usuarios/usuarios';



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
    ChartModule,
    ComponentsModule,
    EncuestaEnstradaSalidaPageModule,
    EncuestaSupervisorPageModule,
    EncuestaClientePageModule,
    AltaPedidoPageModule,
    AltaClientePageModule,
    PedidosPageModule,
    MesasPageModule,
    AltaPlatoPageModule,
    AltaBebidaPageModule,
    AltaSupervisorPageModule,
    AltaDueñoPageModule,
    VerImagenPedidoPageModule

  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SplashPage,
    ModalPage
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
    ScreenOrientation,
    AuthProvider,
    DatosEncuestaProvider,
    platosProvider,
    bebidasProvider,
    UsuariosProvider
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
