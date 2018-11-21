import { UtilProvider } from "./../../../providers/util/util";
import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Slides,
  LoadingController,
  Loading
} from "ionic-angular";
import {
  Camera,
  CameraOptions,
  CameraPopoverOptions
} from "@ionic-native/camera";
import {
  AngularFireStorage,
  AngularFireUploadTask
} from "angularfire2/storage";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
import { IPlato } from "../../../clases/IPlato";
import { platosProvider } from "../../../providers/platos/plato";
//import { Observable } from '@firebase/util';
import { MesasPage } from "../../mesasPages/mesas/mesas";
import {PedidosCocinaPage} from '../../pedidosPages/pedidos-cocina/pedidos-cocina';
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

/**
 * Generated class for the AltaPlatoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-alta-plato",
  templateUrl: "alta-plato.html"
})
export class AltaPlatoPage {
  @ViewChild(Slides) slides: Slides;
  ingredientes: string;
  preparacion: string;
  preparado: string;
  nombre: string;
  importe: number;
  tiempoEstimado: number;
  idPlato: number;
  categoria: string;
  descripcion: string;
  image: string;
  task: AngularFireUploadTask;
  rutaArchivo: string;
  fotoIngredientesTomada: boolean;
  fotoPreparacionTomada: boolean;
  fotoPreparadoTomada: boolean;
  urlIngredientes: string;
  urlPreparacion: string;
  urlPreparado: string;
  platos: Observable<IPlato[]>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera,
    public storage: AngularFireStorage,
    private db: AngularFirestore,
    public loadingCtrl: LoadingController,
    public _platosProvider: platosProvider,
    public _utils: UtilProvider
  ) {
    this.ingredientes = "assets/imgs/ingredientes.png";
    this.preparacion = "assets/imgs/cocinando.png";
    this.preparado = "assets/imgs/preparado.png";
    this.fotoIngredientesTomada = false;
    this.fotoPreparacionTomada = false;
    this.fotoPreparadoTomada = false;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AltaPlatoPage");
  }

  public inicio() {
    this.navCtrl.setRoot(PedidosCocinaPage);
  }
  public siguiente() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
  }
  onIonDrag(event) {
    this.slides.lockSwipes(true);
  }

  public anterior() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
  }

  public captureImage(cual: string) {
    let popoverOptions: CameraPopoverOptions = {
      x: 0,
      y: 0,
      width: 640,
      height: 640,
      arrowDir: this.camera.PopoverArrowDirection.ARROW_DOWN
    };
    const options: CameraOptions = {
      quality: 40,
      targetWidth: 640,
      targetHeight: 640,
      allowEdit: false,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      cameraDirection: this.camera.Direction.BACK,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      popoverOptions: popoverOptions,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    switch (cual) {
      case "ingredientes":
        this.camera.getPicture(options).then(data => {
          this.ingredientes = "data:image/jpg;base64," + data;
        });
        this.fotoIngredientesTomada = true;
        break;
      case "preparacion":
        this.camera.getPicture(options).then(data => {
          this.preparacion = "data:image/jpg;base64," + data;
        });
        this.fotoPreparacionTomada = true;
        break;
      case "preparado":
        this.camera.getPicture(options).then(data => {
          this.preparado = "data:image/jpg;base64," + data;
        });
        this.fotoPreparadoTomada = true;
        break;
    }
  }

  // public subir() {
  //   let loading = this.loadingCtrl.create({
  //     content: `Cargando plato`
  //   });
  //   this.idPlato = new Date().valueOf();
  //   let nuevo: IPlato = {
  //     nombre: this.nombre,
  //     id: this.idPlato,
  //     tiempoEstimado: this.tiempoEstimado,
  //     importe: this.importe,
  //     categoria: this.categoria,
  //     descripcion: this.descripcion,
  //     ingredientesFoto: "",
  //     preparacionFoto: "",
  //     preparadoFoto: ""
  //   };

  //   // ingredientesFoto: "https://firebasestorage.googleapis.com/v0/b/equipo3-74752.appspot.com/o/platos%2F1542488525936%2F1542488525937.jpg?alt=media&token=68dbf3c3-9593-47c2-b0d1-3cc7a4d95fb3",
  //   // preparacionFoto: "https://firebasestorage.googleapis.com/v0/b/equipo3-74752.appspot.com/o/platos%2F1542488525936%2F1542488686312.jpg?alt=media&token=81243cf4-c2d1-49ae-ab4f-371aa1388380",
  //   // preparadoFoto: "https://firebasestorage.googleapis.com/v0/b/equipo3-74752.appspot.com/o/platos%2F1542488525936%2F1542488686312.jpg?alt=media&token=81243cf4-c2d1-49ae-ab4f-371aa1388380"


  //   loading.present();

  //   Promise.all([
  //     this.createUploadTask(this.ingredientes).then(res => {
  //       this._utils.mostrarMensaje(res.downloadURL);
  //       this.storage
  //         .ref(this.rutaArchivo)
  //         .getDownloadURL()
  //         .toPromise();
  //     }),

  //     this.createUploadTask(this.preparacion).then(res => {
  //       this._utils.mostrarMensaje(res.downloadURL);
  //       this.storage
  //         .ref(this.rutaArchivo)
  //         .getDownloadURL()
  //         .toPromise();
  //     }),

  //     this.createUploadTask(this.preparado).then(res => {
  //       this._utils.mostrarMensaje(res.downloadURL);
  //       this.storage
  //         .ref(this.rutaArchivo)
  //         .getDownloadURL()
  //         .toPromise();
  //     })
  //   ]).then(urlImagenes => {
  //     //this._utils.mostrarMensaje("PROMISE ALL TERMINADO");
  //     nuevo.ingredientesFoto = urlImagenes[0];
  //     nuevo.preparacionFoto = urlImagenes[1];
  //     nuevo.preparadoFoto = urlImagenes[2];

  //     setTimeout(() => {
  //       this._platosProvider.guardarPlato(nuevo).then(res => {
  //         //this._utils.mostrarMensaje('TERMINO GUARDAR PLATO');
  //         loading.dismiss().then(()=>{

  //           let platoCargado = this.esperar(
  //             this.creaFondo("¡Plato Cargado!", "assets/imgs/icono_restaurant.png")
  //           );
  //           platoCargado.present();
  //           setTimeout(() => {
  //             platoCargado.dismiss();
    
  //             this.inicio();
  //           }, 2500);


  //         });
          
          
  //       });  
  //     }, 4000);
      

  //   });
  // }

  public guardarPlato(nuevo) {
    this._platosProvider.guardarPlato(nuevo).then(res => {
      let platoCargado = this.esperar(
        this.creaFondo("¡Plato Cargado!", "assets/imgs/icono_restaurant.png")
      );
      platoCargado.present();
      setTimeout(() => {
        platoCargado.dismiss();
        this.inicio();
      }, 2500);
    });
  }

  public subir() {
    let loading = this.loadingCtrl.create({
      content: `Cargando plato`
    });
    this.idPlato = new Date().valueOf();
    let nuevo: IPlato = {
      nombre: this.nombre,
      id: this.idPlato,
      tiempoEstimado: this.tiempoEstimado,
      importe: this.importe,
      categoria: this.categoria,
      descripcion: this.descripcion,
      ingredientesFoto: "",
      preparacionFoto: "",
      preparadoFoto: ""
    };
    loading.present();
    this.createUploadTask(this.ingredientes).then(res => {
      this.storage
        .ref(this.rutaArchivo)
        .getDownloadURL()
        .toPromise()
        .then(urlImagen => {
          nuevo.ingredientesFoto = urlImagen;
          this.createUploadTask(this.preparacion).then(res => {
            this.storage
              .ref(this.rutaArchivo)
              .getDownloadURL()
              .toPromise()
              .then(urlImagen => {
                nuevo.preparacionFoto = urlImagen;
                this.createUploadTask(this.preparado).then(res => {
                  this.storage
                    .ref(this.rutaArchivo)
                    .getDownloadURL()
                    .toPromise()
                    .then(urlImagen =>
                    {
                      nuevo.preparadoFoto = urlImagen;

                      this._platosProvider.guardarPlato(nuevo).then(res => {
                        loading.dismiss();

                        let platoCargado = this.esperar(
                          this.creaFondo(
                            "¡Plato Cargado!",
                            "assets/imgs/icono_restaurant.png"
                          )
                        );
                        platoCargado.present();
                        setTimeout(() => {
                          platoCargado.dismiss();
                          this.inicio();
                        }, 3000);
                      });
                    });
                });
              });
          });
        });
    });
  }

  public createUploadTask(file: string) {
    this.rutaArchivo = `platos/${this.idPlato}/${new Date().getTime()}.jpg`;
    this.image = "data:image/jpg;base64," + file;

    this.task = this.storage.ref(this.rutaArchivo).putString(file, "data_url");

    return this.task;
  }

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
