import { ToastController } from "ionic-angular";
import { AuthProvider } from "./../../providers/auth/auth";
import { usuario, Iusuario } from "./../../clases/usuario";
// import { MesasPage } from './../mesasPages/mesas/mesas';
import { Component } from "@angular/core";
import { Events } from "ionic-angular";
import {
  NavController,
  NavParams,
  Loading,
  LoadingController,
  MenuController
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs";

import "rxjs/add/operator/map";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  constructor(
    private auth: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private angularFire: AngularFireAuth,
    private firestore: AngularFirestore,
    public menuCtrl: MenuController,
    public events1: Events,
    public toastCtrl: ToastController
  ) {
    firestore.firestore.settings({ timestampsInSnapshots: true });
    this.menuCtrl.enable(false, "menu");
  }
  coleccionTipada: AngularFirestoreCollection<usuario>;
  listadoUsuarios: Observable<usuario[]>;
  usuario: usuario;
  nombre: string;
  pass: string;
  clave: string;
  valido: Boolean = false;
  perfil: string;

  ionViewDidLoad() {}

  creaFondo(mensaje, imagen) {
    let fondo = `
          <div>
            <ion-row>
              <ion-col>
                <img src="${imagen}">
              </ion-col>
            </ion-row>
            <ion-row>
              <h1> ${mensaje} </h1>
            </ion-row> 
          </div> `;
    return fondo;
  }

  ingresar(user: string) {
    if (user) {
      this.nombre = user;
    }
    switch (this.nombre) {
      case "admin@gmail.com":
        this.clave = "111111";
        break;
      case "supervisor@gmail.com":
        this.clave = "222222";
        break;
      case "cliente@gmail.com":
        this.clave = "333333";
        break;
      case "cocinero@gmail.com":
        this.clave = "444444";
        break;
      case "bartender@gmail.com":
        this.clave = "555555";
        break;
      case "mozo@gmail.com":
        this.clave = "666666";
        break;
      case "mestre@gmail.com":
        this.clave = "777777";
        break;
      default:
        this.clave = this.pass;
        break;
    }
    this.login();
  }

  login() {
    let destinoPage: string;

    let logueado: Loading = this.esperar();
    logueado.present();

    this.auth.loginUser(this.nombre, this.clave).then(
      (user: Iusuario) => {
        localStorage.setItem("perfil", user.perfil);
        localStorage.setItem("userID", user.id.toString());
        destinoPage = this.auth.buscarDestino(user.perfil);
        this.events1.publish("usuario", user);

        logueado.dismiss().then(() => {
          this.navCtrl.setRoot(destinoPage, {
            usuario: user.nombre,
            perfil: user.perfil
          });
        });
      },
      (error: string) => {
        logueado.dismiss().then(() => this.mostrarMensaje(error));
      }
    );
  }

  // async login2() {
  //   //let esperador = this.esperar();
  //   //esperador.present();
  //   let destinoPage: string;

  //   await this.auth
  //     .loginUser(this.nombre, this.clave)
  //     .then(result => {
  //       //esperador.dismiss();
  //       //let logueado: Loading = this.esperar(this.creaFondo("Ingreso correcto", "assets/imgs/logueado.png"))
  //       let logueado: Loading = this.esperar();
  //       logueado.present();
  //       logueado.onDidDismiss(alto => {
  //         localStorage.setItem("perfil", this.usuario.perfil);
  //         localStorage.setItem("userID", this.usuario.id.toString());
  //         destinoPage = this.auth.buscarDestino(this.usuario.perfil);

  //         this.events1.publish("usuario", this.usuario);
  //         this.navCtrl.setRoot(destinoPage, {
  //           usuario: this.usuario.usuario,
  //           perfil: this.usuario.perfil
  //         });
  //       });
  //       //logueado.dismiss();
  //       this.coleccionTipada = this.firestore.collection<usuario>("usuarios");
  //       // .snapshotChanges() returns a DocumentChangeAction[], which contains
  //       // a lot of information about "what happened" with each change. If you want to
  //       // get the data and the id use the map operator.
  //       this.listadoUsuarios = this.coleccionTipada
  //         .snapshotChanges()
  //         .map(actions => {
  //           return actions.map(a => {
  //             const data = a.payload.doc.data() as usuario;
  //             const id = a.payload.doc.id;
  //             return { id, ...data };
  //           });
  //         });
  //       this.listadoUsuarios
  //         .map(datos => {
  //           return datos.filter(usuarios => usuarios.usuario == this.nombre);
  //         })
  //         .subscribe(res => {
  //           this.usuario = res[0];

  //           logueado.dismiss();

  //           // setTimeout(function () {
  //           //   logueado.dismiss();
  //           // }, 2000);
  //         });
  //     })
  //     .catch(error => {
  //       //esperador.dismiss();
  //       console.log(error);
  //       let errorCode = error.code;
  //       let loadingError;
  //       if (errorCode === "auth/invalid-email") {
  //         loadingError = this.esperar(
  //           this.creaFondo("Usuario inválido", "assets/imgs/error.png")
  //         );
  //       } else if (error === "auth/user-not-found") {
  //         loadingError = this.esperar(
  //           this.creaFondo("Usuario no encontrado", "assets/imgs/error.png")
  //         );
  //       } else if (error === "auth/wrong-password") {
  //         loadingError = this.esperar(
  //           this.creaFondo(
  //             "error con usuario/contraseña",
  //             "assets/imgs/error.png"
  //           )
  //         );
  //       } else {
  //         loadingError = this.esperar(
  //           this.creaFondo("Ha ocurrido un error", "assets/imgs/error.png")
  //         );
  //         console.log(errorCode);
  //       }
  //       loadingError.present();
  //       setTimeout(function() {
  //         loadingError.dismiss();
  //       }, 3000);
  //     });
  // }

  // registrar() {
  //   this.auth.registerUser(this.nombre, this.pass)
  //   .catch((error)=> this.mostrarMensaje(error))
  //   .then(() => {
  //     this.mostrarMensaje("Verifique el mail para confirmar");
  //   });
  // }

  mostrarMensaje(mensaje: string) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });

    toast.present();
  }

  esperar(personalizado?: string): Loading {
    let loading;
    if (!personalizado) {
      loading = this.loadingCtrl.create({
        content: "Por favor, espere..."
      });
    } else {
      loading = this.loadingCtrl.create({
        spinner: "hide",
        content: personalizado
      });
    }
    return loading;
  }
}
