import { Component,  } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../../providers/auth/auth';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {QrEsperaPage} from '../../qr/qr-espera/qr-espera';
import {LoginPage} from '../../login/login';
/**
 * Generated class for the AltaClienteAnonimoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-cliente-anonimo',
  templateUrl: 'alta-cliente-anonimo.html',
})
export class AltaClienteAnonimoPage {
  rutaArchivo:string;
  image:string;
  uid:string;
  fotoTomada: boolean;
  anonimoForm:FormGroup;
  fotoAnonimo:string;
  urlAnonimo:string;
  task:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    public afAuth: AuthProvider,
    public storage: AngularFireStorage,
    public camera: Camera,
    public loadingCtrl:LoadingController) 
  {
    this.presentacion();
    this.fotoTomada = false;
    this.anonimoForm = this.formbuilder.group({
      nombre: ['', Validators.required]
    })
    this.fotoAnonimo = "assets/imgs/cliente.png";
  }

  tomarFoto(){
    this.fotoTomada = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaClienteAnonimoPage');
  }

  public volver(){
    this.navCtrl.setRoot(LoginPage);
  }
  public subir(){
    let loading = this.loadingCtrl.create({
      content: "Cargando..."
    })
    loading.present();
    this.createUploadTask(this.fotoAnonimo)
    .then(res =>{
      this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
      .then(urlImagen =>{
        this.urlAnonimo = urlImagen;
        this.afAuth.ingresoAnonimo()
        .then(data =>{
          loading.dismiss();
          localStorage.setItem("perfil", "Anonimo");
          this.uid = data.uid;
          localStorage.setItem("userID", this.uid);
          localStorage.setItem("fotoAnonimo", this.urlAnonimo);
          this.navCtrl.setRoot(QrEsperaPage);
        })
      })
    })
  }

  public createUploadTask(file: string) {

    this.rutaArchivo = `anonimos/${this.uid}_${ new Date().getTime() }.jpg`;
    this.image = 'data:image/jpg;base64,' + file;
    
    this.task = this.storage.ref(this.rutaArchivo).putString(file, 'data_url');

    return this.task;
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
    this.camera.getPicture(options)
    .then(data =>{
      this.fotoAnonimo = 'data:image/jpg;base64,' + data;
      this.fotoTomada = true;
    })
  }

  public presentacion(){
    let inicio = this.esperar(this.creaFondo("¡Registrate como un cliente anonimo!", "assets/imgs/icono_restaurant.png"));
    inicio.present();
    setTimeout(() => {
      inicio.dismiss();
    }, 3000);
  }
  creaFondo(mensaje, imagen) {
    let fondo = `
          <div>
            <ion-row>
              <ion-col text-center>
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
