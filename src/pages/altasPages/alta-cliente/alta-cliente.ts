import { ICliente } from './../../../clases/ICliente';
import { UtilProvider } from './../../../providers/util/util';
import { LoginPage } from '../../login/login';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  LoadingController,
  MenuController,
  Loading
} from 'ionic-angular';
import {
  Camera,
  CameraOptions,
  CameraPopoverOptions
} from "@ionic-native/camera";
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteProvider } from '../../../providers/cliente/cliente';
import {FotoClientePage} from '../alta-cliente/foto-cliente/foto-cliente';

@IonicPage()
@Component({
  selector: 'page-alta-cliente',
  templateUrl: 'alta-cliente.html'
})
export class AltaClientePage {
  anonimo: string = '';
  mensaje: string = '';
  cargado:boolean =false;
  imagenTomada: string = 'assets/imgs/calavera.png';
  registroAnonimo: Boolean;
  tomoFoto: Boolean = false;
  public formGroup: FormGroup;
  titulo: string = '';
  tipoFoto: string;
  mostrar: boolean = false;
  ldg: Loading = null;
  vieneDeComanda: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  cliente:ICliente
  //
  imagen:string;
  fotoTomada:boolean =false;
  rutaArchivo:string;
  task:any;
  image:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public util: UtilProvider,
    public _cliente: ClienteProvider,
    public camera:Camera,
    public storage:AngularFireStorage,
    params: NavParams
  ) {
    this.menuCtrl.enable(true, 'menu');

    if (params.get('comanda') != null) {
      this.vieneDeComanda = true;
    }

    this.formGroup = this.crearFormulario();
    this.imagen = 'assets/imgs/cliente.png';
  }

  dismiss() {
    let data = {
      nombre: this.formGroup.value.nombre,
      apellido: this.formGroup.value.apellido,
      dni: this.formGroup.value.numeroDocu
    };
    
    this.viewCtrl.dismiss(data);
  }

  saveData() {
    this.presentLoading('Guardando cliente...');



    setTimeout(() => {
      if(localStorage.getItem('perfil') === null){
        this._cliente
          .saveCliente(this.cliente)
          .then(() =>{
            this.ldg.dismiss();
            this.navCtrl.setRoot(LoginPage);
          }).catch(err => {
            this.ldg.dismiss().then(()=>{
              this.util.mostrarMensaje(err);
            })
          });
          
      }
      else{
        this._cliente
        .saveCliente(this.cliente)
        .then(() => {
          this.ldg.dismiss().then(() => {
            if (this.vieneDeComanda) {
              this.dismiss();
            } else {
              this.util.volverRoot();
            }
          });
        })
        .catch(err => {
          this.ldg.dismiss().then(()=>{
            this.util.mostrarMensaje(err);
          })
        });
      }
    }, 1000);
  }

  presentLoading(mensaje: string) {
    this.ldg = this.loadingCtrl.create({
      spinner: 'dots',
      content: mensaje
    });
    this.ldg.present();
  }

  private crearFormulario() {
    return this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z]*'),Validators.required])],
      apellido: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z]*'),Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      tipoDocu: ['DNI', Validators.required],
      numeroDocu: ['', Validators.compose([Validators.pattern('[0-9]{8}'), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  public infoCargada(){
    this.cargado = true;
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  /// CARGA DE FOTO
  public captureImage() {
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
    this.camera.getPicture(options).then(data => {
      this.imagen = "data:image/jpg;base64," + data;
      this.fotoTomada = true;
    });
  }

  public createUploadTask(file: string) {

    this.rutaArchivo = `clientes/${this.formGroup.value.email}/${new Date().getTime()}.jpg`;
    this.image = 'data:image/jpg;base64,' + file;

    this.task = this.storage.ref(this.rutaArchivo).putString(file, 'data_url');

    return this.task;
  }

  public subir(){
    this.createUploadTask(this.imagen)
    .then(res =>{
      this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
      .then(urlImagen =>{
        this.cliente  = {
          nombre: this.formGroup.value.nombre,
          apellido: this.formGroup.value.apellido,
          email: this.formGroup.value.email,
          tipoDocu: this.formGroup.value.tipoDocu,
          numeroDocu: this.formGroup.value.numeroDocu,
          password: this.formGroup.value.password,
          foto: urlImagen
        };
        this.saveData();
      })
    })
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
