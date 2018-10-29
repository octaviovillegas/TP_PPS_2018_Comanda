import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

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
  ingredientes:string;
  preparacion:string;
  preparado:string;
  nombre:string;
  importe:string;
  categoria:string;
  image:string;
  task:AngularFireUploadTask;
  rutaArchivo:string;
  fotoIngredientesTomada:boolean;
  fotoPreparacionTomada:boolean;
  fotoPreparadoTomada:boolean;
  urlIngredientes:string;
  urlPreparacion:string;
  urlPreparado:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public camera:Camera,
    public storage: AngularFireStorage,
    private db: AngularFirestore,
    public loadingCtrl:LoadingController
    ) 
  {
    this.ingredientes = "assets/imgs/ingredientesBebida.png";
    this.preparacion = "assets/imgs/preparacion.png";
    this.preparado = "assets/imgs/preparadoBebida.png";
    this.fotoIngredientesTomada = false;
    this.fotoPreparacionTomada = false;
    this.fotoPreparadoTomada = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaBebidaPage');
  }

  public siguiente(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
  }
  onIonDrag(event){
    this.slides.lockSwipes(true);
  }

  public anterior(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
  }

  public captureImage(cual:string){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }


    switch (cual) {
      case 'ingredientes':
        this.camera.getPicture(options)
        .then(data =>{
          this.ingredientes = 'data:image/jpg;base64,' + data;
        })
        this.fotoIngredientesTomada = true;
        break;
      case 'preparacion':
        this.camera.getPicture(options)
        .then(data =>{
          this.preparacion = 'data:image/jpg;base64,' + data;
        })
        this.fotoPreparacionTomada = true;
        break;
      case 'preparado':
        this.camera.getPicture(options)
        .then(data =>{
          this.preparado = 'data:image/jpg;base64,' + data;
        })
        this.fotoPreparadoTomada = true;
        break;
      default:
        break;
    }
  }

  public subir(){
    let loading = this.loadingCtrl.create({
      content: `Cargando Bebida`
    })
    loading.present();
    this.createUploadTask(this.ingredientes)
    .then(res =>{
      this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
      .then(urlImagen =>{
        this.urlIngredientes = urlImagen;
        this.createUploadTask(this.preparacion)
        .then(res =>{
          this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
          .then(urlImagen =>{
            this.urlPreparacion = urlImagen;
            this.createUploadTask(this.preparado)
            .then(res =>{
              this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
              .then(urlImagen =>{
                this.urlPreparado =urlImagen;
                this.db.collection('bebidas').add({
                  nombre: this.nombre,
                  importe: this.importe,
                  categoria: this.categoria,
                  urlIngredientes: this.urlIngredientes,
                  urlPreparacion: this.urlPreparacion,
                  urlPreparado: this.urlPreparado
                })
                .then(res =>{
                  loading.dismiss();
                })
              })
            })
          })
        })
      })
    })
  }

  public createUploadTask(file: string) {

    this.rutaArchivo = `bebidas/${this.nombre}_${ new Date().getTime() }.jpg`;
    this.image = 'data:image/jpg;base64,' + file;
    
    this.task = this.storage.ref(this.rutaArchivo).putString(file, 'data_url');

    return this.task;
  }

}
