import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { IMesa } from "./../../clases/IMesa";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { Observable } from "rxjs";

@Injectable()
export class MesasProvider {

  public listaMesas: AngularFireList<IMesa>;
  public items: Observable<any[]>;
  //public listaMesas: FirebaseListObservable<any>;

  constructor(public afDB: AngularFireDatabase) {
    //Traigo las Comandas por usuario

    this.listaMesas = this.afDB.list('/mesas');

    this.items = this.listaMesas.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  // guardarMesa(nuevo: IMesa) {
  //   return this.afDB.list('/mesas/').push(nuevo);
  // }

  guardarMesa(nuevo: IMesa): Promise<any> {
    //primero guaro la imagen para obtener la URL, y colocarla como campo en la encuesta
    let promesa = new Promise((resolve, reject) => {
      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

      let uploadTask: firebase.storage.UploadTask = storeRef
        .child(`Mesas/${nuevo.idMesa}`)
        .putString(nuevo.img, "base64", { contentType: "image/jpeg" });

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        next => {}, // saber el % de cuantos Mbs se han subido
        error => {
          // manejo de error
          reject();
        },
        () => {
          // Tomo la URL
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            nuevo.img = url;
            this.afDB
              .list("/mesas/")
              .push(nuevo)
              .then(() => resolve());
          });
          resolve();
        }
      );
    });
    return promesa;
  }

  traerMesas() {
    return this.afDB.list("/mesas/").valueChanges();
  }
  
  public traerMesasconId(){
    return this.afDB.list<IMesa[]>("/mesas/").snapshotChanges()
    .map(actions =>{
      return actions.map(a =>{
        const data = a.payload.val() as IMesa;
        const idMesa = a.payload.key;
        return {idMesa, ...data};
      })
    })
  }

  buscarMesa(codigoQR: string) {

    return this.items;

    // return this.afDB
    //   .list("/mesas/", ref => ref.orderByChild("codigoQr").equalTo(codigoQR))
    //   .valueChanges();
  }
}
