<<<<<<< HEAD
import { Camera, CameraPopoverOptions, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
=======
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides,  } from 'ionic-angular';
>>>>>>> master

/**
 * Generated class for the AltaClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-cliente',
  templateUrl: 'alta-cliente.html',
})
export class AltaClientePage {
  @ViewChild(Slides) slides: Slides;
  anonimo:string="";
  mensaje:string="";
  imagenTomada:string="assets/imgs/calavera.png";
  registroAnonimo:Boolean;
  tomoFoto:Boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, ) {
    this.registroAnonimo = false;
  }

  ngAfterViewInit(){
    //this.slides.lockSwipeToNext(true);
    //this.slides.lockSwipeToPrev(true);
  }
  public siguiente(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
  }
  public anterior(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
  }
  public iniciar(anonimo:string){
    this.slides.lockSwipes(false);
    this.anonimo = anonimo;
    if(this.anonimo == 'anonimo'){
      this.registroAnonimo = true;
      this.slides.slideNext();
    }
    else{
      this.registroAnonimo = false;
      this.slides.slideTo(3, 500, false);
    }
  }

  public anteriorCliente(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
  }
  onIonDrag(event){
    this.slides.lockSwipes(true);
  }
  tomarFoto(){
    this.tomoFoto = true;
  }

<<<<<<< HEAD
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
    public loadingCtrl: LoadingController

  ) {

    this.formGroup = this.crearFormulario();


=======
  public principal(){
    this.navCtrl.pop();
>>>>>>> master
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

