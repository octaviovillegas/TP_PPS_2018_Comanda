import { Observable } from 'rxjs/Observable';
import { UtilProvider } from './../../../providers/util/util';
import { IMesa } from './../../../clases/IMesa';
import { MesasProvider } from './../../../providers/mesas/mesas';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, MenuController, Loading, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraPopoverOptions, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the AltaMesaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-mesa',
  templateUrl: 'alta-mesa.html',
})
export class AltaMesaPage {
  anonimo: string = "";
  mensaje: string = "";
  imagenTomada: string = "assets/imgs/calavera.png";
  registroAnonimo: Boolean;
  tomoFoto: Boolean = false;

  public formGroup: FormGroup;
  titulo: string = "";
  tipoFoto: string;
  mostrar: boolean = false;

  qrData = null;
  codigoGenerado = "";
  public imagenPreview: string = 'assets/imgs/sinImg.png';
  public imagen64: string = "";


  constructor(
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    private camera: Camera,
    private platform: Platform,
    public utilProvider: UtilProvider,
    public _mesas: MesasProvider

  ) {
    this.menuCtrl.enable(true, 'menu');
    this.formGroup = this.crearFormulario();
  }

  crearFormulario() {
    return this.formBuilder.group({
      numero: ['', Validators.required],
      capacidad: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  tomarFotoCliente() {
    this.mensaje = "Foto guardada";
    this.tomoFoto = true;
  }


  guardarMesa() {
    let nuevaMesa: IMesa = {
      idMesa: new Date().valueOf(),
      numero: this.formGroup.value.numero,
      capacidad: this.formGroup.value.capacidad,
      tipo: this.formGroup.value.tipo,
      img: this.imagen64,
      codigoQr: this.codigoGenerado
    }

    this.utilProvider.presentLoading('Guardando mesa...')
    setTimeout(() => {
      this._mesas.guardarMesa(nuevaMesa).then(() => {
        this.utilProvider.dismiss().then(() =>
          this.utilProvider.volverRoot()
        );
      });
    }, 1000);
  }



  crearCodigoQR() {
    if (!this.numeroExiste(this.formGroup.controls['numero'].value)) {

      this.qrData = `Mesa_numero_${this.formGroup.controls['numero'].value}`;
      this.codigoGenerado = this.qrData;
    }
    else {
      this.utilProvider.mostrarMensaje('El numero de mesa ya existe');
    }

  }

  numeroExiste(numero: number): any {
    this._mesas.traerMesas().subscribe(dataMesas => {
      return dataMesas.some((m: IMesa) => m.numero === numero);
    });
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
        this.utilProvider.mostrarMensaje("Error en la cámara:" + JSON.stringify(err));
      });
    }
  }





}
