import { UtilProvider } from './../../../providers/util/util';
import { AuthProvider } from './../../../providers/auth/auth';
import { DatosEncuestaProvider } from '../../../providers/datos/datosEncuesta';
import { Camera, CameraPopoverOptions, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, MenuController, Loading, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-encuesta-enstrada-salida',
  templateUrl: 'encuesta-enstrada-salida.html',
})
export class EncuestaEnstradaSalidaPage {
  anonimo: string = "";
  mensaje: string = "";
  imagenTomada: string = "assets/imgs/calavera.png";
  registroAnonimo: Boolean;
  tomoFoto: Boolean = false;
  observacion: String = "";
  cocina: string = "limpia";
  nivelSuciedad: number = 0;


  public frmEncuesta: FormGroup;

  titulo: string = "";
  tipoFoto: string;
  mostrar: boolean = false;
  public rate: any;
  public entSal: number = 0;
  public tituloEnSal: string;
  ldg: Loading = null;
  public habilitado: boolean = true;
  public imagenPreview: string = 'assets/imgs/sinImg.png';
  public imagen64: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public _datos: DatosEncuestaProvider,
    private camera: Camera,
    private platform: Platform,
    public util: UtilProvider

  ) {

    let subs: Subscription = _datos.getCantEncuestaES().subscribe((data) => {
      this.entSal = data.length;

      console.log("getEncuestasES: " + this.entSal);
      if (this.entSal == 2) {
        this.util.mostrarMensaje('Las encuestas ya fueron cargadas');
        this.util.volverRoot();
      }
      else if (this.entSal == 1)
        this.tituloEnSal = "Salida";
      else
        this.tituloEnSal = "Entrada";
    });

    //Asi no queda escuchando la lista desde la base
    setTimeout(() => {
      subs.unsubscribe();
    }, 2000);

    this.menuCtrl.enable(true, 'menu');
    this.frmEncuesta = this.crearFormulario();
  }

  tomarFotoCliente() {
    this.mensaje = "¡Opa! Que bien saliste";
    this.tomoFoto = true;
  }

  saveData() {
    this.presentLoading('Guardando encuesta...');
    let tipoEncuesta: string;

    if (this.entSal == 0) {
      tipoEncuesta = "Entrada";
    } else {
      tipoEncuesta = "Salida";
    }

    //Para que muestre el loading 1 segundo
    setTimeout(() => {
      this._datos.saveEncuestaES(tipoEncuesta, this.frmEncuesta.value.estado,
        this.frmEncuesta.value.elementos, this.frmEncuesta.value.banio,
        this.frmEncuesta.value.cocina, this.frmEncuesta.value.nivelSuciedad,
        this.frmEncuesta.value.observaciones, this.imagen64).then(() => {
          this.ldg.dismiss().then(() =>
            this.util.volverRoot()
          );
        });
    }, 1000);

  }

  private crearFormulario() {

    return this.formBuilder.group({
      estado: ['', Validators.required],
      elementos: ['true', Validators.required],
      banio: ['', Validators.required],
      cocina: ['limpia', Validators.required],
      nivelSuciedad: ['0'],
      observaciones: ['']
    });

  }

  ionViewWillLeave() {
    if (this.ldg != null)
      this.ldg.dismiss();
  }

  presentLoading(mensaje:string) {
    this.ldg = this.loadingCtrl.create({
      spinner:'dots',
      content: mensaje
    });
    this.ldg.present();
  }

  mostrarCamara() {

    if (this.platform.is("cordova")) {
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
        popoverOptions: popoverOptions
      }

      this.camera.getPicture(options).then((imageData) => {

        this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
        this.imagen64 = imageData;

      }, (err) => {
        // Handle error
        this.util.mostrarMensaje("Error en la cámara:" + JSON.stringify(err));
      });
    }
  }
}
  // mostrarMensaje(mensaje:string){
  //   this.toastCtrl.create({
  //     message: mensaje,
  //     duration: 2000,
  //     position: 'top'
  //   }).present();
  // }

  // presentToast() {
  //   const toast = this.toastCtrl.create({
  //     message: 'Las encuestas ya fueron cargadas',
  //     duration: 3000
  //   });
  //   toast.present().then(()=>
  //     this.volverRoot()
  //   );
  // }

