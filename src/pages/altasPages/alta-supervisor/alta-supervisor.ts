import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController, Loading } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Iusuario } from '../../../clases/usuario';
import {UsuariosProvider} from '../../../providers/usuarios/usuarios';
//import { regexValidators } from '../validators/validator';
/**
 * Generated class for the AltaSupervisorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-supervisor',
  templateUrl: 'alta-supervisor.html',
})
export class AltaSupervisorPage {
  @ViewChild(Slides) slides: Slides;
  supervisorForm:FormGroup;
  fotoNuevo:string;
  fotoTomada:Boolean;
  image:string;
  task:any;
  rutaArchivo:string;
  perfil:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder:FormBuilder,
    public camera: Camera,
    public storage: AngularFireStorage,
    public loadingCtrl: LoadingController,
    public usuariosProveedor: UsuariosProvider,
    public angAut: AngularFireAuth) 
  {
    this.fotoNuevo = "assets/imgs/persona.png";
    this.fotoTomada = false;
    this.perfil = this.navParams.get('perfil');
    this.perfil = "Supervisor";
    this.supervisorForm = this.formBuilder.group({
      email: [
        '', Validators.required
      ],
      nombre: [
        '', Validators.required
      ],
      apellido: [
        '', Validators.required
      ],
      dni: [
        '', Validators.required
      ],
      cuil: [
        '', Validators.required
      ]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaSupervisorPage');
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
    this.camera.getPicture(options)
    .then(data =>{
      this.fotoNuevo = 'data:image/jpg;base64,' + data;
    })
    this.fotoTomada = true;
  }

  public createUploadTask(file: string) {

    this.rutaArchivo = `platos/${this.supervisorForm.controls['email'].value}_${ new Date().getTime() }.jpg`;
    this.image = 'data:image/jpg;base64,' + file;
    
    this.task = this.storage.ref(this.rutaArchivo).putString(file, 'data_url');

    return this.task;
  } 

  public subir(){
    let cargandoFoto = this.loadingCtrl.create({
      content: 'Cargando foto...'
    });
    let nuevo:Iusuario = {
      nombre: this.supervisorForm.controls['nombre'].value,
      apellido: this.supervisorForm.controls['apellido'].value,
      dni: this.supervisorForm.controls['dni'].value,
      foto: "",
      perfil: this.perfil,
      email: this.supervisorForm.controls['email'].value,
      cuil: this.supervisorForm.controls['cuil'].value,
    }
    cargandoFoto.present();
    this.createUploadTask(this.fotoNuevo)
    .then(res =>{
      
      this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
      .then(urlImagen =>{
        nuevo.foto = urlImagen;
        cargandoFoto.dismiss();
        let cargandoDatos = this.loadingCtrl.create({
          content: 'Cargando cuenta...'
        })
        cargandoDatos.present();
        this.angAut.auth.createUserWithEmailAndPassword(nuevo.email, nuevo.dni.toString())
        .then(result =>{
          cargandoDatos.dismiss();
          this.usuariosProveedor.guardarSupervisor(nuevo)
          .then(result =>{
          })
        })
        .catch(error =>{
          cargandoDatos.dismiss();
          let errorAuth = this.esperar(this.creaFondo(error.code, 'assets/imgs/error.png'))
          errorAuth.present();
          setTimeout(() => {
            errorAuth.dismiss();
          }, 7000);
        })
      })
      .catch(error =>{
        cargandoFoto.dismiss();
        let errorFoto = this.esperar(this.creaFondo('error cargando foto', 'assets/imgs/error.png'));
        errorFoto.present();
        setTimeout(() => {
          errorFoto.dismiss();
        }, 3000);
      })
    })
    .catch(error =>{
      console.log(error);
    })
    
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
