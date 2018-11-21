import { IReserva } from './../../clases/IReserva';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { IMesa } from "./../../clases/IMesa";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { Observable, Observer, Subscription } from "rxjs";
import { ReservaProvider } from '../reserva/reserva';

@Injectable()
export class MesasProvider {

  public listaMesas: AngularFireList<IMesa>;
  public items: Observable<any[]>;
  //public listaMesas: FirebaseListObservable<any>;

  constructor(public afDB: AngularFireDatabase, public _reservas: ReservaProvider) {
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
        next => { }, // saber el % de cuantos Mbs se han subido
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

  public traerMesasconId() {
    return this.afDB.list<IMesa[]>("/mesas/").snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.val() as IMesa;
          const key = a.payload.key;
          return { key, ...data };
        })
      })
  }

  //**Busca la mesa por ID, y devuelve una promesa con el Numero */
  buscarNroMesa(idMesa: number): Promise<string> {

    return new Promise<string>((resolve, reject) => {

      this.afDB
        .list("/mesas/", ref => ref.orderByChild("idMesa").equalTo(idMesa))
        .valueChanges().subscribe((data: IMesa[]) => {
          if (data.length > 0) { //encontro una mesa
            console.log(data[0].numero.toString());
            resolve(data[0].numero.toString());
          } else {
            resolve("");
          }
        })
    })
  }

  //**Busca mesas libres, dependiendo de la reserva */
  buscarMesasLibres(reserva: IReserva): Observable<IMesa[]> {
    let listaMesas: IMesa[] = [];

    this.traerMesasUtilizadasXFechaTUrno

    this.afDB
      .list("/mesas/")
      .valueChanges().subscribe((data: IMesa[]) => {

        this.traerMesasUtilizadasXFechaTUrno(reserva.fecha, reserva.turno).then((lista: number[]) => {

          //Si la mesa no esta en la lista de las mesas usadas la agrego a listaMesas que sera la lista definitiva
          data.map(val => {
            if (lista != null) {

              if (lista.indexOf(val.idMesa) == -1) { // Si no la encuentra en la lista la agrego
                if (parseInt(val.capacidad) >= reserva.comensales)
                  listaMesas.push(val);
              }
            } else {
              if (parseInt(val.capacidad) >= reserva.comensales)
                listaMesas.push(val);
            }
          })
        })
      });

    return Observable.create((observer: Observer<IMesa[]>) => {
      observer.next(listaMesas);
    });
  }

  //**Devuelve las mesas que fueron utilizadas para una fecha y turno en particular */
  public traerMesasUtilizadasXFechaTUrno(fecha: string, turno: number): Promise<number[]> {
    let mesas: number[] = [];
    let subs: Subscription;

    let promesa = new Promise<number[]>((resolve, reject) => {

      subs = this._reservas.traerReservasConfirmadas()
        .subscribe((lista: IReserva[]) => {
          for (let i = 0; i < lista.length; i++) {
            if (lista[i].fecha == fecha && lista[i].turno == turno) {
              mesas.push(lista[i].mesaID);
            }
          }

          resolve(mesas);
        });
    })

    // setTimeout(() => {
    //   subs.unsubscribe();
    // }, 3000);

    return promesa;
  }
}
