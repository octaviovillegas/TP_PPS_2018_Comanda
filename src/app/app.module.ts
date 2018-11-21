import { ReservaClientePageModule } from '../pages/reservas/reserva-cliente/reserva-cliente.module';
import { ReservasPageModule } from '../pages/reservas/reservas.module'
import { PedidosCocinaPageModule } from "./../pages/pedidosPages/pedidos-cocina/pedidos-cocina.module";
import { AltaComandaPageModule } from "./../pages/pedidosPages/alta-comanda/alta-comanda.module";
import { EncuestaEnstradaSalidaPageModule } from "../pages/encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida.module";
import { EncuestaSupervisorPageModule } from "../pages/encuestasPages/encuesta-supervisor/encuesta-supervisor.module";
import { EncuestaClientePageModule } from "../pages/encuestasPages/encuesta-cliente/encuesta-cliente.module";
import { AltaPedidoPageModule } from "./../pages/pedidosPages/alta-pedido/alta-pedido.module";
import { AltaClientePageModule } from "../pages/altasPages/alta-cliente/alta-cliente.module";
import { AltaPlatoPageModule } from "../pages/altasPages/alta-plato/alta-plato.module";
import { AltaBebidaPageModule } from "../pages/altasPages/alta-bebida/alta-bebida.module";
import { PedidosPageModule } from "../pages/pedidosPages/pedidos/pedidos.module";
import { MesasPageModule } from "./../pages/mesasPages/mesas/mesas.module";
import { AltaSupervisorPageModule } from "./../pages/altasPages/alta-supervisor/alta-supervisor.module";
import { AltaDueñoPageModule } from "./../pages/altasPages/alta-dueño/alta-dueño.module";
import { VerImagenPedidoPageModule } from "../pages/pedidosPages/ver-imagen-pedido/ver-imagen-pedido.module";
import { QrPropinaPageModule } from "./../pages/qr/qr-propina/qr-propina.module";
import { AltaMesaPageModule } from "./../pages/altasPages/alta-mesa/alta-mesa.module";
import { AltaClienteAnonimoPageModule } from "../pages/altasPages/alta-cliente-anonimo/alta-cliente-anonimo.module";
import { QrEsperaPageModule } from "../pages/qr/qr-espera/qr-espera.module";
import { EsperaPageModule } from "../pages/espera/espera.module";
import { ModalEsperaPageModule } from "../pages/espera/modal-espera/modal-espera.module";
import {TraspasoPedidoPageModule} from "../pages/qr/qr-espera/traspaso-pedido/traspaso-pedido.module";
import {AltaEmpleadoPageModule} from '../pages/altasPages/alta-empleado/alta-empleado.module';
import {InicioClientePageModule} from '../pages/inicio-cliente/inicio-cliente.module';

import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  Modal,
  NavParams
} from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { SplashPage } from "../pages/splash/splash";
import { ModalPage } from "../pages/modal/modal";
import {
  DeviceMotion,
  DeviceMotionAccelerationData
} from "@ionic-native/device-motion";
//AF

import { AngularFireModule } from "angularfire2";
import {
  AngularFireDatabaseModule,
  AngularFireDatabase
} from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";
// CAMERA
import { Camera } from "@ionic-native/camera";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { ChartModule } from "primeng/chart";

//import { ImgPreloadDirective } from '../directives/img-preload/img-preload';
import { IonicImageLoader } from "ionic-image-loader";
import { NativeAudio } from "@ionic-native/native-audio";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { ComponentsModule } from "../components/components.module";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AuthProvider } from "../providers/auth/auth";
import { DatosEncuestaProvider } from "../providers/datos/datosEncuesta";
import { platosProvider } from "../providers/platos/plato";
import { bebidasProvider } from "../providers/bebidas/bebidas";
import { UsuariosProvider } from "../providers/usuarios/usuarios";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { MesasProvider } from "../providers/mesas/mesas";
import { UtilProvider } from "../providers/util/util";
import { ComandaProvider } from "../providers/comanda/comanda";
import { ClienteProvider } from "../providers/cliente/cliente";
import { EsperaProvider } from "../providers/espera/espera";
import { ReservaProvider } from '../providers/reserva/reserva';

export const firebaseConfig = {
  apiKey: "AIzaSyDsDUoXfo8kvkYOm9Q8DzWHF82QVGltwo4",
  authDomain: "equipo3-74752.firebaseapp.com",
  databaseURL: "https://equipo3-74752.firebaseio.com",
  projectId: "equipo3-74752",
  storageBucket: "equipo3-74752.appspot.com",
  messagingSenderId: "418317265409",
  automaticDataCollectionEnabled: false
};
@NgModule({
  declarations: [MyApp, HomePage, LoginPage, SplashPage, ModalPage],
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
    VerImagenPedidoPageModule,
    QrPropinaPageModule,
    NgxQRCodeModule,
    AltaMesaPageModule,
    AltaComandaPageModule,
    AltaClienteAnonimoPageModule,
    QrEsperaPageModule,
    EsperaPageModule,
    ModalEsperaPageModule,
    PedidosCocinaPageModule,
    TraspasoPedidoPageModule,
    ReservaClientePageModule,
    ReservasPageModule,
    AltaEmpleadoPageModule,
    InicioClientePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, LoginPage, SplashPage, ModalPage],
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
    BarcodeScanner,
    AuthProvider,
    DatosEncuestaProvider,
    platosProvider,
    bebidasProvider,
    UsuariosProvider,
    MesasProvider,
    UtilProvider,
    ComandaProvider,
    ClienteProvider,
    EsperaProvider,
    ModalEsperaPageModule,
    TraspasoPedidoPageModule,
    ReservaProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
