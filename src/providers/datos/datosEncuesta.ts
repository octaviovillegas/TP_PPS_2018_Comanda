import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';


@Injectable()
export class DatosEncuestaProvider {


  encuestaESLista: Array<any>;

  constructor(public afDB: AngularFireDatabase, public toastCtrl: ToastController) {

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
        })
    });

    return promesa;
  }

  /**Genera la fecha en formato YYYYMMdd */
  private obtenerFechaNombre(): string {
    let fecha: Date = new Date();

    return fecha.getFullYear().toString() + (fecha.getMonth() + 1).toString() + fecha.getDate().toString();
  }

  public guardarEncuesta(relacionColegas:string, 
    puntualidad: string, actitud:string,
    eficacia:string)
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
  saveEncuestaCliente2(calidadServicio: string,
    recomienda: string, estadoResto: string, estadoMesa: string,
    calidadPlatos: string, observaciones: string,
    imagenes: Array<string>): Promise<any> {

    var fechaS: string;
    let userID: String = localStorage.getItem("userID");


    let nombreArchivo: string;
    var img1: string = '';
    var img2: string = '';
    var img3: string = '';

    fechaS = this.obtenerFechaNombre();

    let promesa = new Promise((resolve, reject) => {

      let storeRef = firebase.storage().ref();

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
                //this.presentToast("ERROR Archivo: " + i);
                reject();
              }, () => {
                // Tomo la URL

                uploadTask.snapshot.ref.getDownloadURL().then((url) => {

                  //this.presentToast("URL: " + i);
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

                resolve();
              })
          },

          (err) => { },

          () => { //Una vez guardadas todas las fotos, se ejecuta el complete del Observable

            setTimeout(() => {
              // this.presentToast("GUARDAAA!!!");
              this.afDB.object('/encuestaCliente/' + userID + '/' + fechaS).update({
                calidadServicio: calidadServicio,
                recomienda: recomienda,
                estadoResto: estadoResto,
                estadoMesa: estadoMesa,
                calidadPlatos: calidadPlatos,
                observaciones: observaciones,
                imagen1: img1,
                imagen2: img2,
                imagen3: img3
              }).then(() => resolve());

            }, 5000);
            resolve();
          }
        )
      } else { //Guardo la encuesta sin fotos
        //console.log("Guardando encuesta");
        this.afDB.object('/encuestaCliente/' + userID + '/' + fechaS).update({
          calidadServicio: calidadServicio,
          recomienda: recomienda,
          estadoResto: estadoResto,
          estadoMesa: estadoMesa,
          calidadPlatos: calidadPlatos,
          observaciones: observaciones,
          imagen1: img1,
          imagen2: img2,
          imagen3: img3
        }).then(() => resolve());
      }
    });

    return promesa;
  }

  /** Guarda la encuesta de CLIENTE por usuario */
  // saveEncuestaCliente2(estado: string,
  //   elementos: string, banio: string, cocina: string,
  //   nivelSuciedad: string, observaciones: string,
  //   img1: string, img2: string, img3: string) {

  //   let userID: String = localStorage.getItem("userID");
  //   let fecha: Date = new Date();
  //   let fechaS: String;
  //   let img: string;

  //   fechaS = this.obtenerFechaNombre();

  //   //primero guaro la imagen para obtener la URL, y colocarla como campo en la encuesta
  //   let promesa = new Promise((resolve, reject) => {

  //     let storeRef = firebase.storage().ref();
  //     let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

  //     let uploadTask: firebase.storage.UploadTask =
  //       storeRef.child(`img/${nombreArchivo}`)
  //         .putString(img, 'base64', { contentType: 'image/jpeg' });

  //     this.presentToast("IMG: " + nombreArchivo);
  //     uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //       () => { }, // saber el % de cuantos Mbs se han subido
  //       (error) => {
  //         // manejo de error
  //         reject();
  //       }, () => {
  //         // Tomo la URL
  //         uploadTask.snapshot.ref.getDownloadURL().then((url) => {

  //           this.afDB.object('/encuestaCliente/' + userID + '/' + fechaS).update({
  //             estado: estado,
  //             elementos: elementos,
  //             banio: banio,
  //             cocina: cocina,
  //             nivelSuciedad: nivelSuciedad,
  //             observaciones: observaciones,
  //             imagen1: img1,
  //             imagen2: img2,
  //             imagen3: img3
  //           });
  //         });

  //         resolve();
  //       })

  //   });

  //   return promesa;
  // }

  presentToast(mensaje: string) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });

    toast.present();
  }

  /** Guarda la encuesta de CLIENTE por usuario */
  // saveEncuestaCliente(estado: string,
  //   elementos: string, banio: string, cocina: string,
  //   nivelSuciedad: string, observaciones: string,
  //   imagenes: Array<string>) {
  //   var subject = new Subject();
  //   var subjectImg = new Subject();

  //   let storeRef = firebase.storage().ref();
  //   let userID: String = localStorage.getItem("userID");
  //   let fecha: Date = new Date();
  //   let fechaS: String;
  //   let imagenesURL: Array<string> = [];
  //   let img1: string = '';
  //   let img2: string = '';
  //   let img3: string = '';
  //   let obs: Observable<any>;
  //   let obs1: Observable<any>;
  //   let obs2: Observable<any>;


  //   fechaS = this.obtenerFechaNombre();

  //   let prom = new Promise((resolve, reject) => {


  //     if (imagenes[0] != '') {

  //       let promesa = new Promise((resolve, reject) => {
  //         let storeRef = firebase.storage().ref();
  //         let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

  //         let uploadTask: firebase.storage.UploadTask =
  //           storeRef.child(`img/${nombreArchivo}`)
  //             .putString(imagenes[0], 'base64', { contentType: 'image/jpeg' });

  //         uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //           () => { }, // saber el % de cuantos Mbs se han subido
  //           (error) => {
  //             // manejo de error
  //             reject();
  //           }, () => {
  //             // Tomo la URL
  //             uploadTask.snapshot.ref.getDownloadURL().then((url) => {

  //               imagenesURL.push(url);
  //               resolve();
  //             });
  //           })
  //       });

  //       obs = Observable.fromPromise(promesa);
  //     }

  //     if (imagenes[1] != '') {

  //       let promesa = new Promise((resolve, reject) => {
  //         let storeRef = firebase.storage().ref();
  //         let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

  //         let uploadTask: firebase.storage.UploadTask =
  //           storeRef.child(`img/${nombreArchivo}`)
  //             .putString(imagenes[1], 'base64', { contentType: 'image/jpeg' });

  //         uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //           () => { }, // saber el % de cuantos Mbs se han subido
  //           (error) => {
  //             // manejo de error
  //             reject();
  //           }, () => {
  //             // Tomo la URL
  //             uploadTask.snapshot.ref.getDownloadURL().then((url) => {

  //               imagenesURL.push(url);
  //               resolve();
  //             });
  //           })
  //       });

  //       obs1 = Observable.fromPromise(promesa);
  //     }

  //     if (imagenes[2] != '') {

  //       let promesa = new Promise((resolve, reject) => {
  //         let storeRef = firebase.storage().ref();
  //         let nombreArchivo: string = new Date().valueOf().toString(); // 1231231231

  //         let uploadTask: firebase.storage.UploadTask =
  //           storeRef.child(`img/${nombreArchivo}`)
  //             .putString(imagenes[2], 'base64', { contentType: 'image/jpeg' });

  //         uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //           () => { }, // saber el % de cuantos Mbs se han subido
  //           (error) => {
  //             // manejo de error
  //             reject();
  //           }, () => {
  //             // Tomo la URL
  //             uploadTask.snapshot.ref.getDownloadURL().then((url) => {
  //               imagenesURL.push(url);
  //               resolve();
  //             });
  //           })
  //       });

  //       obs2 = Observable.fromPromise(promesa);
  //     }

  //     switch (imagenesURL.length) {
  //       case 1:
  //         obs.subscribe(() => { }, (err) => { }, () => {
  //           this.afDB.object('/encuestaCliente/' + userID + '/' + fechaS).update({
  //             estado: estado,
  //             elementos: elementos,
  //             banio: banio,
  //             cocina: cocina,
  //             nivelSuciedad: nivelSuciedad,
  //             observaciones: observaciones,
  //             imagen1: imagenesURL[0],
  //             imagen2: '',
  //             imagen3: ''
  //           }).then(() => resolve());
  //         });

  //         break;
  //       case 2:
  //         obs.subscribe(() => { }, (err) => { }, () => {
  //           obs1.subscribe(() => { }, (err) => { }, () => {
  //             this.afDB.object('/encuestaCliente/' + userID + '/' + fechaS).update({
  //               estado: estado,
  //               elementos: elementos,
  //               banio: banio,
  //               cocina: cocina,
  //               nivelSuciedad: nivelSuciedad,
  //               observaciones: observaciones,
  //               imagen1: imagenesURL[0],
  //               imagen2: imagenesURL[1],
  //               imagen3: ''
  //             }).then(() => resolve());
  //           })
  //         });
  //         break;
  //       case 3:
  //         obs.subscribe(() => { }, (err) => { }, () => {
  //           obs1.subscribe(() => { }, (err) => { }, () => {
  //             obs2.subscribe(() => { }, (err) => { }, () => {

  //               this.afDB.object('/encuestaCliente/' + userID + '/' + fechaS).update({
  //                 estado: estado,
  //                 elementos: elementos,
  //                 banio: banio,
  //                 cocina: cocina,
  //                 nivelSuciedad: nivelSuciedad,
  //                 observaciones: observaciones,
  //                 imagen1: imagenesURL[0],
  //                 imagen2: imagenesURL[1],
  //                 imagen3: imagenesURL[2]
  //               }).then(() => resolve());
  //             })
  //           })
  //         });

  //         break;
  //     }


  //   });

  //   return prom;
  // }

}
