import { AngularFireDatabase } from 'angularfire2/database';
import { IMesa } from './../../clases/IMesa';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class MesasProvider {

  constructor(public afDB: AngularFireDatabase) { }

  // guardarMesa(nuevo: IMesa) {
  //   return this.afDB.list('/mesas/').push(nuevo);
  // }


  guardarMesa(nuevo: IMesa): Promise<any> {

    //primero guaro la imagen para obtener la URL, y colocarla como campo en la encuesta
    let promesa = new Promise((resolve, reject) => {

      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

      let uploadTask: firebase.storage.UploadTask =
        storeRef.child(`Mesas/${nuevo.idMesa}`)
          .putString(nuevo.img, 'base64', { contentType: 'image/jpeg' });

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (next) => { }, // saber el % de cuantos Mbs se han subido
        (error) => {
          // manejo de error
          reject();
        }, () => {
          // Tomo la URL
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            nuevo.img = url;
            this.afDB.list('/mesas/').push(nuevo).then(() => resolve());
          });
          resolve();
        })
    });
    return promesa;
  }

  traerMesas() {
    return this.afDB.list('/mesas/').valueChanges();
  }

}
