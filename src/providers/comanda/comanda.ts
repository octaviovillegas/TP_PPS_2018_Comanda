import { map } from "rxjs/operators";
import { IComanda } from "./../../clases/IComanda";
import { ToastController } from "ionic-angular";
//import { Observable } from "rxjs/Observable";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { IMesa } from "../../clases/IMesa";
import { MesasProvider } from "../mesas/mesas";
import { Observable, Subscription } from "rxjs";

@Injectable()
export class ComandaProvider {
  public lista: AngularFireList<IComanda>;
  public comandasAbiertas: AngularFireList<IComanda[]>;

  //public items: Observable<any[]>;
  //public subs: Subscription = null;

  constructor(
    public afDB: AngularFireDatabase,
    public toastCtrl: ToastController,
    public _mesas: MesasProvider
  ) {
    //Traigo las Comandas por usuario
    // this.lista = this.afDB.list("/Mesa_Comandas", ref =>
    //   ref.equalTo(localStorage.getItem("userID"), "userID")
    // );

    this.lista = this.afDB.list("/Mesa_Comandas");
    this.comandasAbiertas = this.afDB.list("/Mesa_Comandas", ref =>
    ref
      .orderByChild("estado")
      .equalTo("Abierta")
    );


    // this.items = this.lista
    //   .snapshotChanges()
    //   .pipe(
    //     map(changes =>
    //       changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
    //     )
    //   );
  }

  /** Guarda una comanda */
  saveComanda(comanda: IComanda, mesa: IMesa, mesaKey: string): Promise<any> {
    //let userID: String = localStorage.getItem("userID");
    //let fecha: Date = new Date();
    //let fechaS: String;

    //primero guaro la imagen para obtener la URL, y colocarla como campo en la encuesta
    let promesa = new Promise((resolve, reject) => {
      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

      if (comanda.fotoCliente != "") {
        try{
        // Si tiene una imagen, la guardo y la asigno a la comanda
          let uploadTask: firebase.storage.UploadTask = storeRef
            .child(`comandas/${nombreArchivo}`)
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
                this.guardarComanda(comanda, mesa, mesaKey, url);
              });

              resolve();
            }
          );
        }
        catch{
          this.guardarComanda(comanda,mesa, mesaKey, comanda.fotoCliente);
        }
      } else {
        //No tiene imagen

        this.guardarComanda(comanda, mesa, mesaKey).then(
          (resultado: Boolean) => {
            if (resultado) resolve();
            else reject();
          },
          () => {
            reject();
          }
        );
      }
    });

    return promesa;
  }

  // actualizarComanda(comanda: IComanda): Promise<Boolean> {
  //   let promesa = new Promise<Boolean>((resolve, reject) => {
  //     //Me devuelve una referencia al objeto de la lista, asi me aseguro de Updatear y no generar una nueva Comanda

  //     this.subs = this.items.subscribe(data => {
  //       for (let i = 0; i < data.length; i++) {
  //         if (data[i].id == comanda.id) {
  //           let ref = firebase.database().ref("/Mesa_Comandas/" + data[i].key);

  //           ref.ref.update(comanda).then(
  //             () => {
  //               resolve(true);
  //             },
  //             err => {
  //               reject(false);
  //             }
  //           );

  //           break;
  //         }
  //       }
  //     });
  //   });

  //   return promesa;
  // }

  actualizarComanda(comanda: IComanda): Promise<Boolean> {
    let promesa = new Promise<Boolean>((resolve, reject) => {
      //Me devuelve una referencia al objeto de la lista, asi me aseguro de Updatear y no generar una nueva Comanda

      this.afDB.object("/Mesa_Comandas/" + comanda.id).update(comanda)
      .then(()=>resolve(true))
      .catch((err)=> reject(err));
    });

    return promesa;
  }


  private guardarComanda(
    comanda: IComanda,
    mesa: IMesa,
    mesaKey: string,
    url?: string
  ): Promise<Boolean> {
    if (url != null) comanda.fotoCliente = url; // Si tiene URL se la asigno

    let promesa = new Promise<Boolean>((resolve, reject) => {



    this.afDB.object("/Mesa_Comandas/" + comanda.id).update(comanda).then(
        () => {
          //CAMBIO EL ESTADO DE LA MESA A OCUPADA
          //console.log(mesaKey);
          let ref = firebase.database().ref("/mesas/" + mesaKey);

          ref.ref.update({ estado: "Ocupada", comanda: comanda.id }).then(
            () => {
              resolve(true);
            },
            err => {
              reject(false);
            }
          );
        },
        err => {
          reject(false);
        }
      );
      
      // // this.lista.push(comanda).then(
      // //   () => {
      // //     //CAMBIO EL ESTADO DE LA MESA A OCUPADA
      // //     //console.log(mesaKey);
      // //     let ref = firebase.database().ref("/mesas/" + mesaKey);

      // //     ref.ref.update({ estado: "Ocupada", comanda: comanda.id }).then(
      // //       () => {
      // //         resolve(true);
      // //       },
      // //       err => {
      // //         reject(false);
      // //       }
      // //     );
      // //   },
      // //   err => {
      // //     reject(false);
      // //   }
      // // );
    });

    return promesa;
  }

  public buscarComandas(){
    return this.lista;
  }

  verificarComandaPorUsuario(comandaID: number): Promise<IComanda> {
    let promesa = new Promise<IComanda>((resolve, reject) => {
      let userID: string = localStorage.getItem("userID");
      let encontro: boolean = false;

      let subs = this.lista.valueChanges().subscribe(
        (comandas: IComanda[]) => {
          for (let i = 0; i < comandas.length; i++) {
            if (comandas[i].id == comandaID) {
              if (comandas[i].MozoId == userID) {
                resolve(comandas[i]);
                encontro = true;
                break;
              }
            }
          }

          if (!encontro)
            //no le pertenece la Comanda al usuario
            resolve(null);
        },
        err => {
          reject(err);
        }
      );

      setTimeout(() => {
        subs.unsubscribe();
      }, 2000);
    });
    return promesa;
  }

  cerrarComanda(comanda: IComanda, mesaKey: string): Promise<Boolean> {
    let promesa = new Promise<Boolean>((resolve, reject) => {
      this.actualizarComanda(comanda).then((actualizo: Boolean) => {
        if (actualizo) {
          let ref = firebase.database().ref("/mesas/" + mesaKey);

          ref.ref.update({ estado: "Libre", comanda: 0 }).then(
            () => {
              resolve(true);
            },
            err => {
              reject(false);
            }
          );
        } else {
          reject();
        }
      });
    });

    return promesa;
  }
}
