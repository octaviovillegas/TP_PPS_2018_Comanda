import { Iusuario } from "./../../clases/usuario";
import { UsuariosProvider } from "./../usuarios/usuarios";
import { AngularFireAuth } from "angularfire2/auth";
import { Injectable } from "@angular/core";
import { LoginPage } from "../../pages/login/login";
import { Observable, BehaviorSubject } from "rxjs";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { of } from "rxjs/observable/of";

import * as firebase from "firebase";

@Injectable()
export class AuthProvider {
  //public perfilLogueado: string;
  uid: string;
  public perfil$ = new BehaviorSubject("");

  constructor(
    private afAuth: AngularFireAuth,
    public _usuario: UsuariosProvider
  ) { }

  //**Registro de usuario. Si logra crear el usuario envia el mail de verificacion */
  registerUser(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .catch(err => Promise.reject(err))
      .then(
        () => {
          // El usuario se ha creado correctamente.
          // envio el mail para confirmar el mail
          let user = firebase.auth().currentUser;

          user
            .sendEmailVerification()
            .then(user => Promise.resolve(user))
            .catch(error => Promise.reject(error));
        },

        () => Promise.reject("Reintente por favor")
      );
  }

  //**Login al sistema. Valida que el mail haya sido verificado. Si encuentra el usuario lo envia como respuesta */
  loginUser(email: string, password: string): Promise<any> {
    
    let promesa = new Promise((resolve, reject) => {
      console.log(email);
      console.log(password);
      this.afAuth.auth
        .signInWithEmailAndPassword(email.toLowerCase(), password)
        .then(data => {
          console.log(data.uid);
          this.uid = data.uid;
          let user = firebase.auth().currentUser;
          // Busco el usuario x mail y lo devuelvo
          this._usuario
            .buscarUsuarioxMail(user.email)
            .catch(() => {
              reject("Usuario inexistente");
            })
            .then((u: Iusuario) => {
              if (u.perfil == "Cliente") {
                if (user.emailVerified) {
                  u.id = this.uid;
                  resolve(u);
                  ``;
                } else {
                  reject("Email no verificado");
                }
              } else {
                resolve(u);
              }
            });
        });
    });

    return promesa;

    // try {
    //   await this.afAuth.auth
    //     .signInWithEmailAndPassword(email, password);
    //   let user = firebase.auth().currentUser;
    //   if (user.emailVerified) {
    //     // Busco el usuario x mail y lo devuelvo
    //     this._usuario
    //       .buscarUsuarioxMail(user.email)
    //       .catch(() => Promise.reject())
    //       .then((u: Iusuario) => {
    //         Promise.resolve(u);
    //       });
    //   }
    //   else {
    //     console.log("Email no verificado");
    //     Promise.reject("Email no verificado");
    //   }
    // }
    // catch (e) {
    //   return Promise.reject("Reintente por favor");
    // }
  }
  // Devuelve la session
  get Session() {
    return this.afAuth.authState;
  }
  // Logout de usuario
  logout() {
    this.afAuth.auth.signOut().then(() => {
      // hemos salido
    });
  }

  buscarPerfil(): Observable<String> {
    return this.perfil$.asObservable();
  }

  buscarDestino(perfil: string): string {
    let destinoPage: string;
    this.perfil$.next(perfil);

    switch (perfil) {
      case "Dueño":
        destinoPage = "ReservasPage";
        break;

      case "Supervisor":
        destinoPage = "ReservasPage";
        break;

      case "Cliente":
        destinoPage = "InicioClientePage";
        break;

      case "Anonimo":
        destinoPage = "QrEsperaPage";
        break;

      case "Cocinero":
        destinoPage = "PedidosCocinaPage";
        break;

      case "Bartender":
        destinoPage = "PedidosCocinaPage";

        break;
      case "Mozo":
        destinoPage = "MesasPage";
        break;

      case "Mestre":
        destinoPage = "EsperaPage";
        break;

      default:
        destinoPage = "LoginPage";
        break;
    }

    return destinoPage;
  }

  public ingresoAnonimo() {
    return this.afAuth.auth.signInAnonymously();
  }

  public esAnonimo() {
    let ay: any;
    ay = this.afAuth.auth.onAuthStateChanged(user => {
      console.log(user);
    });
  }

  public obtenerEmailUsuarioActual() {
    return this.afAuth.auth.currentUser.email;
  }
}
