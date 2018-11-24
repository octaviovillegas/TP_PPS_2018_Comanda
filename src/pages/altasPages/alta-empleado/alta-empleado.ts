import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController,Loading } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Iusuario } from '../../../clases/usuario';
import {UsuariosProvider} from '../../../providers/usuarios/usuarios';
import {AuthProvider} from '../../../providers/auth/auth';
/**
 * Generated class for the AltaEmpleadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-empleado',
  templateUrl: 'alta-empleado.html',
})
export class AltaEmpleadoPage {
  @ViewChild(Slides) slides: Slides;
  altaEmpleadoForm1:FormGroup;
  fotoNuevo:string;
  fotoTomada:Boolean;
  perfil:String;

  image:string;
  task:any;
  rutaArchivo:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder:FormBuilder,
    public camera: Camera,
    public storage: AngularFireStorage,
    public loadingCtrl: LoadingController,
    public usuariosProveedor: UsuariosProvider,
    public angAut: AngularFireAuth,
    public auth: AuthProvider) {
    this.fotoNuevo = "assets/imgs/persona.png";
    this.fotoTomada = false;
    this.altaEmpleadoForm1 = this.formBuilder.group({
      email: ['',Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      cuil: ['', Validators.required],
      perfil: ['',Validators.required]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaEmpleadoPage');
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

    this.rutaArchivo = `usuarios/${this.altaEmpleadoForm1.controls['email'].value}_${ new Date().getTime() }.jpg`;
    this.image = 'data:image/jpg;base64,' + file;
    
    this.task = this.storage.ref(this.rutaArchivo).putString(file, 'data_url');

    return this.task;
  }
  public subir(){
    let cargandoFoto = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    let nuevo:Iusuario = {
      nombre: this.altaEmpleadoForm1.controls['nombre'].value,
      apellido: this.altaEmpleadoForm1.controls['apellido'].value,
      dni: this.altaEmpleadoForm1.controls['dni'].value,
      foto: "",
      perfil: this.altaEmpleadoForm1.controls['perfil'].value,
      email: this.altaEmpleadoForm1.controls['email'].value,
      cuil: this.altaEmpleadoForm1.controls['cuil'].value,
    }
    cargandoFoto.present();
    this.angAut.auth.createUserWithEmailAndPassword(nuevo.email, nuevo.dni.toString())
    .then(result =>{
      this.createUploadTask(this.fotoNuevo)
      .then(result =>{
        this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
        .then(urlImagen =>{
          nuevo.foto = urlImagen;
          this.usuariosProveedor.guardarSupervisor(nuevo)
          .then(result =>{
            cargandoFoto.dismiss();
            let usuarioGuardado = this.esperar(this.creaFondo("Se ha creado con exito!", "assets/imgs/logueado.png"))
            usuarioGuardado.present();
            setTimeout(() => {
              usuarioGuardado.dismiss();
              this.navCtrl.setRoot(this.auth.buscarDestino(localStorage.getItem('perfil')));
            }, 7000);
          })
          .catch(error =>{
            cargandoFoto.dismiss();
          })
        })
        .catch(error =>{
          cargandoFoto.dismiss();
          let errorLoading = this.esperar(this.creaFondo("Ha ocurrido un error subiendo la foto","assets/imgs/error.png"));
          errorLoading.present();
          setTimeout(() => {
            errorLoading.dismiss();
          }, 5000);
          
        })
      })
    })
    .catch(error =>{
      cargandoFoto.dismiss();
      let errorLoading = this.esperar(this.creaFondo(this.usuariosProveedor.errorAuth(error), "assets/imgs/error.png"));
      errorLoading.present();
      setTimeout(() => {
        errorLoading.dismiss();
      }, 4000);
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
