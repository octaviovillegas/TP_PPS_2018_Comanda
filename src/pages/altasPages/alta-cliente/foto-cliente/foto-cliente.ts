import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Loading, LoadingController } from 'ionic-angular';
import {
  Camera,
  CameraOptions,
  CameraPopoverOptions
} from "@ionic-native/camera";
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import {ClienteProvider} from '../../../../providers/cliente/cliente';
import {ICliente} from '../../../../clases/ICliente';
import {AuthProvider} from '../../../../providers/auth/auth';
import {UtilProvider} from '../../../../providers/util/util';
import { LoginPage } from '../../../login/login';

/**
 * Generated class for the FotoClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-foto-cliente',
  templateUrl: 'foto-cliente.html',
})
export class FotoClientePage {
  imagen:string;
  email:string;
  rutaArchivo:string;
  task:any;
  image:string;
  cliente:ICliente;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public camera: Camera,
    public storage: AngularFireStorage,
    public proveedorCliente:ClienteProvider,
    public auth: AuthProvider,
    public util:UtilProvider,
    public loadingCtrl:LoadingController) {
    this.imagen = 'assets/imgs/cliente.png';
    this.email = this.navParams.get('email');
    
    this.proveedorCliente.buscarClienteEmail(this.email)
    .subscribe(data =>{
      this.cliente = data[0];
      console.log(data);
    })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FotoClientePage');
  }

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
    });
  }

  public createUploadTask(file: string) {

    this.rutaArchivo = `clientes/${this.email}/${new Date().getTime()}.jpg`;
    this.image = 'data:image/jpg;base64,' + file;

    this.task = this.storage.ref(this.rutaArchivo).putString(file, 'data_url');

    return this.task;
  }

  public subir(){
    let subiendo = this.loadingCtrl.create({
      content:'Cargando Foto...'
    })
    subiendo.present();
    this.createUploadTask(this.imagen)
    .then(res =>{
      this.storage.ref(this.rutaArchivo).getDownloadURL().toPromise()
      .then(urlImagen =>{
        this.cliente.foto = urlImagen;
        this.proveedorCliente.actualizarCliente(this.cliente)
        .then(data =>{
          subiendo.dismiss();
          let actualizado = this.esperar(this.creaFondo("¡Foto cargada!", "assets/imgs/icono_restaurant.png"));
          actualizado.present();
          setTimeout(() => {
            actualizado.dismiss();
            if(localStorage.getItem('perfil') == null){
              this.navCtrl.setRoot(LoginPage);
            }
            else{
              this.util.volverRoot();
            }
            
          }, 4000);
        })
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
