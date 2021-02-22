import { IPlato } from './../../../clases/IPlato';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController, Loading } from 'ionic-angular';
import { Camera, CameraOptions, CameraPopoverOptions } from '@ionic-native/camera';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { IComestible } from '../../../clases/IComestible';
import { bebidasProvider } from '../../../providers/bebidas/bebidas';
import { Observable } from 'rxjs/Observable';
import { MesasPage } from '../../mesasPages/mesas/mesas'
import {PedidosCocinaPage} from '../../pedidosPages/pedidos-cocina/pedidos-cocina';

/**
 * Generated class for the AltaBebidaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-bebida',
  templateUrl: 'alta-bebida.html',
})
export class AltaBebidaPage {
  @ViewChild(Slides) slides: Slides;
  ingredientes: string;
  preparacion: string;
  preparado: string;
  nombre: string;
  tiempoEstimado: number;
  idBebida: number;
  importe: number;
  categoria: string;
  descripcion: string
  image: string;
  task: AngularFireUploadTask;
  rutaArchivo: string;
  fotoIngredientesTomada: boolean;
  fotoPreparacionTomada: boolean;
  fotoPreparadoTomada: boolean;
  urlIngredientes: string;
  urlPreparacion: string;
  urlPreparado: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera,
    public storage: AngularFireStorage,
    private db: AngularFirestore,
    public loadingCtrl: LoadingController,
    public bebidaProveedor: bebidasProvider,
  ) {
    this.ingredientes = "assets/imgs/ingredientesBebida.jpg";
    this.preparacion = "assets/imgs/preparacion.jpg";
    this.preparado = "assets/imgs/preparadoBebida.jpg";
    this.fotoIngredientesTomada = false;
    this.fotoPreparacionTomada = false;
    this.fotoPreparadoTomada = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaBebidaPage');
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

  public inicio() {
    this.navCtrl.setRoot(PedidosCocinaPage) // Cambiar por menu principal de cocinero
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
      case 'ingredientes':
        this.camera.getPicture(options)
          .then(data => {
            this.ingredientes = 'data:image/jpg;base64,' + data;
          })
        this.fotoIngredientesTomada = true;
        break;
      case 'preparacion':
        this.camera.getPicture(options)
          .then(data => {
            this.preparacion = 'data:image/jpg;base64,' + data;
          })
        this.fotoPreparacionTomada = true;
        break;
      case 'preparado':
        this.camera.getPicture(options)
          .then(data => {
            this.preparado = 'data:image/jpg;base64,' + data;
          })
        this.fotoPreparadoTomada = true;
        break;
      default:
        break;
    }
  }

  public subir() {
    let loading = this.loadingCtrl.create({
      content: `Cargando Bebida...`
    })
    loading.present();
    this.idBebida = new Date().valueOf();
    let nuevo: IPlato = {
      id: this.idBebida,
      nombre: this.nombre,
      importe: this.importe,
      tiempoEstimado: this.tiempoEstimado,
      descripcion: this.descripcion,
      ingredientesFoto: "",
      preparacionFoto: "",
      preparadoFoto: "",
      categoria: 'Bebidas'
    }
    this.createUploadTask(this.ingredientes)
      .then(res => {
        this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
          .then(urlImagen => {
            nuevo.ingredientesFoto = urlImagen;
            this.createUploadTask(this.preparacion)
              .then(res => {
                this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
                  .then(urlImagen => {
                    nuevo.preparacionFoto = urlImagen;
                    this.createUploadTask(this.preparado)
                      .then(res => {
                        this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
                          .then(urlImagen => {
                            nuevo.preparadoFoto = urlImagen;
                            this.bebidaProveedor.guardarBebida(nuevo)
                              .then(res => {
                                loading.dismiss();
                                let platoCargado = this.esperar(this.creaFondo("Bebida Cargada!", "assets/imgs/icono_restaurant.png"))
                                platoCargado.present();
                                setTimeout(() => {
                                  platoCargado.dismiss();
                                  this.inicio();
                                }, 4000);
                              })
                          })
                      })
                  })
              })
          })
      })
  }

  public createUploadTask(file: string) {

    this.rutaArchivo = `bebidas/${this.idBebida}/${new Date().getTime()}.jpg`;
    this.image = 'data:image/jpg;base64,' + file;

    this.task = this.storage.ref(this.rutaArchivo).putString(file, 'data_url');

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

        content: 'Por favor, espere...'
      });
    }
    else {
      loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: personalizado,
      })
    }
    return loading;
  }

}
