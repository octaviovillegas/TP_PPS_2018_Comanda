import { IComanda } from "./../../clases/IComanda";
import { ToastController, BlockerDelegate } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from "@angular/core";
import * as firebase from "firebase";
// import { Subject } from 'rxjs';

@Injectable()
export class ComandaProvider {
  constructor(
    public afDB: AngularFireDatabase,
    public toastCtrl: ToastController
  ) {}

  /** Guarda una comanda */
  saveComanda(comanda: IComanda): Promise<any> {
    //let userID: String = localStorage.getItem("userID");
    let fecha: Date = new Date();
    let fechaS: String;

    //primero guaro la imagen para obtener la URL, y colocarla como campo en la encuesta
    let promesa = new Promise((resolve, reject) => {
      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

      if (comanda.fotoCliente != "") {
        // Si tiene una imagen, la guardo y la asigno a la comanda
        let uploadTask: firebase.storage.UploadTask = storeRef
          .child(`img/${nombreArchivo}`)
          .putString(comanda.fotoCliente, "base64", {
            contentType: "image/jpeg"
          });

        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {}, // saber el % de cuantos Mbs se han subido
          error => {
            // manejo de error
            reject();
          },
          () => {
            // Tomo la URL
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
              this.guardarComanda(comanda, url);
            });

            resolve();
          }
        );
      } else {
        //No tiene imagen
        this.guardarComanda(comanda);
      }
    });

    return promesa;
  }

 
  private guardarComanda(comanda: IComanda, url?: string) {
    if (url != null) comanda.fotoCliente = url;  // Si tiene URL se la asigno

    this.afDB
      .list("/Mesa_Comandas/")
      .push(comanda)
      .then(() => {
        return true;
      });
  }
}
