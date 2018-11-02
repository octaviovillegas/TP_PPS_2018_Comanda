import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';


@Injectable()
export class DatosEncuestaProvider {


  encuestaESLista: Array<any>;

  constructor(public afDB: AngularFireDatabase) {

  }


  /** Obtiene la cantidad de EncuestaES por usuario y fecha del dia. */
  getCantEncuestaES(): Observable<{}[]> {
    let userID: String = localStorage.getItem("userID");
    let fecha: Date = new Date();
    let fechaS: String;
    let cant: number = 0;

    fechaS = this.obtenerFechaNombre();

    return this.afDB.list('/encuestaES/' + userID + '/' + fechaS).valueChanges();
  }

  /** Guarda la encuesta de ENTRADA y SALIDA por usuario */
  saveEncuestaES(entSal: string, estado: string,
    elementos: string, banio: string, cocina: string,
    nivelSuciedad: string, observaciones: string,
    img: string): Promise<any> {

    let userID: String = localStorage.getItem("userID");
    let fecha: Date = new Date();
    let fechaS: String;

    fechaS = this.obtenerFechaNombre();


    //primero guaro la imagen para obtener la URL, y colocarla como campo en la encuesta
    let promesa = new Promise((resolve, reject) => {

      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

      let uploadTask: firebase.storage.UploadTask =
        storeRef.child(`img/${nombreArchivo}`)
          .putString(img, 'base64', { contentType: 'image/jpeg' });

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => { }, // saber el % de cuantos Mbs se han subido
        (error) => {
          // manejo de error
          reject();
        }, () => {
          // Tomo la URL
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {

            this.afDB.object('/encuestaES/' + userID + '/' + fechaS + '/' + entSal).update({
              entSal: entSal,
              estado: estado,
              elementos: elementos,
              banio: banio,
              cocina: cocina,
              nivelSuciedad: nivelSuciedad,
              observaciones: observaciones,
              imagen: url
            }).then(() => resolve());
          });

          resolve();
        }
      )
    });

    return promesa;
  }

  /**Genera la fecha en formato YYYYMMdd */
  private obtenerFechaNombre(): string {
    let fecha: Date = new Date();

    return fecha.getFullYear().toString() + (fecha.getMonth() + 1).toString() + fecha.getDate().toString();
  }

  /** Obtiene la encuesta del CLIENTE por usuario y fecha del dia. */
  getCantEncuestaCliente(): Observable<{}[]> {
    let userID: String = localStorage.getItem("userID");
    let fecha: Date = new Date();
    let fechaS: String;
    let cant: number = 0;

    fechaS = this.obtenerFechaNombre();

    return this.afDB.list('/encuestaCliente/' + userID + '/' + fechaS).valueChanges();
  }

  /** Guarda la encuesta de CLIENTE por usuario */
  saveEncuestaCliente(estado: string,
    elementos: string, banio: string, cocina: string,
    nivelSuciedad: string, observaciones: string,
    imagenes: Array<string>): Promise<any> {

    var fechaS: string;
    let userID: String = localStorage.getItem("userID");

    let storeRef = firebase.storage().ref();
    let nombreArchivo: string;
    var img1: string = '';
    var img2: string = '';
    var img3: string = '';

    fechaS = this.obtenerFechaNombre();

    let promesa = new Promise((resolve, reject) => {

      if (imagenes.length > 0) {
        var source = Observable.range(0, imagenes.length);


        source.subscribe(
          (i: number) => { //esta parte se ejecuta por cada iteracion del source. Primero debo guardar todas las imagenes, para tomar todas las URLs

            nombreArchivo = new Date().valueOf().toString(); // 1231231231

            let uploadTask: firebase.storage.UploadTask =
              storeRef.child(`img/${nombreArchivo}`)
                .putString(imagenes[i], 'base64', { contentType: 'image/jpeg' });

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
              () => { }, // saber el % de cuantos Mbs se han subido
              (error) => {
                // manejo de error
                reject();
              }, () => {
                // Tomo la URL
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {

                  switch (i) {
                    case 0:
                      img1 = url;
                      break;
                    case 1:
                      img2 = url;
                      break;
                    case 2:
                      img3 = url;
                      break;
                  }

                });
              })
          },

          (err) => { },

          () => { //Una vez guardadas todas las fotos, se ejecuta el complete del Observable

            this.afDB.object('/encuestaCliente/' + userID + '/' + fechaS).update({
              estado: estado,
              elementos: elementos,
              banio: banio,
              cocina: cocina,
              nivelSuciedad: nivelSuciedad,
              observaciones: observaciones,
              imagen1: img1,
              imagen2: img2,
              imagen3: img3
            }).then(() => resolve());
          }
        )
      } else { //Guardo la encuesta sin fotos
        this.afDB.object('/encuestaCliente/' + userID + '/' + fechaS).update({
          estado: estado,
          elementos: elementos,
          banio: banio,
          cocina: cocina,
          nivelSuciedad: nivelSuciedad,
          observaciones: observaciones,
          imagen1: img1,
          imagen2: img2,
          imagen3: img3
        }).then(() => resolve());
      }
    });

    return promesa;
  }
}
