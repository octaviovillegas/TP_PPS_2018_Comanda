import { AuthProvider } from './../../../providers/auth/auth';
import { DatosEncuestaProvider } from '../../../providers/datos/datosEncuesta';
import { Camera, CameraPopoverOptions, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, MenuController, Loading, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-encuesta-cliente',
  templateUrl: 'encuesta-cliente.html',
})
export class EncuestaClientePage {
  anonimo: string = "";
  mensaje: string = "";
  imagenTomada: string = "assets/imgs/calavera.png";
  registroAnonimo: Boolean;
  tomoFoto: Boolean = false;
  observacion: String = "";
  mesa: string = "limpia";
  calPlatos: number = 0;
  imagenes64List: Array<string> = [];
  imagenesPViewList: Array<string> = [];


  public frmEncuesta: FormGroup;

  titulo: string = "";
  tipoFoto: string;
  mostrar: boolean = false;
  public rate: any;
  public entSal: number = 0;
  ldg: Loading = null;
  public habilitado: boolean = true;
  public verBotonFoto: boolean = true;
  public hayFoto: boolean = false;
  //public imagenPreview: string = 'assets/imgs/sinImg.png';
  //public imagen64:string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public _datos: DatosEncuestaProvider,
    private auth: AuthProvider,
    private camera: Camera,
    private platform: Platform

  ) {

    let subs: Subscription = _datos.getCantEncuestaCliente().subscribe((data) => {
      this.entSal = data.length;

      console.log(this.entSal);
      if (this.entSal > 0)
        this.presentToast("Ya se ha cargado la encuesta de satisfacción", true);

    });

    //Asi no queda escuchando la lista desde la base
    setTimeout(() => {
      subs.unsubscribe();
    }, 3000);

    this.menuCtrl.enable(true, 'menu');
    this.frmEncuesta = this.crearFormulario();
  }

  presentToast(mensaje: string, volver: boolean) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present().then(() => {

      if (volver)
        this.volverRoot()

    });
  }

  tomarFotoCliente() {
    this.mensaje = "¡Opa! Que bien saliste";
    this.tomoFoto = true;
  }

  saveData() {
    this.presentLoading('Guardando encuesta...');
    // let tipoEncuesta: string;

    // if (this.entSal == 0) {
    //   tipoEncuesta = "Entrada";
    // } else {
    //   tipoEncuesta = "Salida";
    // }

    //Para que muestre el loading 1 segundo
    setTimeout(() => {
      this._datos.saveEncuestaCliente2(this.frmEncuesta.value.calidadServicio,
        this.frmEncuesta.value.recomienda, this.frmEncuesta.value.estadoResto,
        this.frmEncuesta.value.estadoMesa, this.frmEncuesta.value.calidadPlatos,
        this.frmEncuesta.value.observaciones, this.imagenes64List)
        .then(() => {
         // this.presentToast("SALIO DE PROMESA", false);
          this.ldg.dismiss().then(() =>
            this.volverRoot()
          ).catch((error) => {
            this.presentToast("Ha ocurrido un error. Reintente por favor.", false);
          });
        });
    }, 1000);

  }

  volverRoot() {
    this.navCtrl.setRoot(this.auth.buscarDestino(localStorage.getItem("perfil")));
  }

  private crearFormulario() {

    return this.formBuilder.group({
      calidadServicio: ['', Validators.required],
      recomienda: ['false', Validators.required],
      estadoResto: ['', Validators.required],
      estadoMesa: ['', Validators.required],
      calidadPlatos: ['1'],
      observaciones: ['']
    });

  }

  presentLoading(mensaje: string) {
    this.ldg = this.loadingCtrl.create({
      spinner: 'dots',
      content: mensaje
    });

    this.ldg.present();
  }

  ionViewWillLeave() {
    if (this.ldg != null)
      this.ldg.dismiss();
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

        this.hayFoto = true;
        this.imagenesPViewList.push('data:image/jpeg;base64,' + imageData);
        this.imagenes64List.push(imageData);

        // Se permiten maximo, 3 fotos
        if (this.imagenes64List.length == 3)
          this.verBotonFoto = false;

      }, (err) => {
        // Handle error
        this.mostrarMensaje("Error en la cámara:" + JSON.stringify(err));
      });
    }
  }

  mostrarMensaje(mensaje: string) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    }).present();
  }

  prueba() {
    //this._datos.prueba3();
    // this._datos.prueba().then(() => { console.log("FIN PROMISE") });
  }
}
