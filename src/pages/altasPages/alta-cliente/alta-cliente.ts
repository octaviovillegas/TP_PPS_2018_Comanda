import { Camera, CameraPopoverOptions, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-alta-cliente',
  templateUrl: 'alta-cliente.html',
})
export class AltaClientePage {
  anonimo:string="";
  mensaje:string="";
  imagenTomada:string="assets/imgs/calavera.png";
  registroAnonimo:Boolean;
  tomoFoto:Boolean = false;


  public formGroup: FormGroup;

  titulo: string = "";

  tipoFoto: string;

  mostrar: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private camera: Camera,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public menuCtrl: MenuController

  ) {
    this.menuCtrl.enable(true, 'menu');
    this.formGroup = this.crearFormulario();


  }

  tomarFotoCliente(){
    this.mensaje = "¡Opa! Que bien saliste";
    this.tomoFoto = true;
  }

  saveData() {
    console.log(this.formGroup.value);
  }

  private crearFormulario() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      tipodocumento: ['DNI', Validators.required],
      numerodocumento: ['', Validators.required]
      // dateBirth: ['', Validators.required],
      // passwordRetry: this.formBuilder.group({
      //   password: ['', Validators.required],
      //   passwordConfirmation: ['', Validators.required]
      //}),
      //gender: ['', Validators.required],
    });


  }


  mostrarCamara() {

    let popoverOptions: CameraPopoverOptions = {
      x: 0,
      y: 0,
      width: 800,
      height: 800,
      arrowDir: this.camera.PopoverArrowDirection.ARROW_DOWN
    };

    const options: CameraOptions = {
      quality: 40,
      targetWidth: 800,
      targetHeight: 800,
      allowEdit: false,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      cameraDirection: this.camera.Direction.BACK,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }


  }

}

