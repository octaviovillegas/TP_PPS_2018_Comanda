import { AuthProvider } from './../../../providers/auth/auth';
import { DatosProvider } from './../../../providers/datos/datos';
//import { Camera, CameraPopoverOptions, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, MenuController, Loading } from 'ionic-angular';
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


  public frmEncuesta: FormGroup;

  titulo: string = "";
  tipoFoto: string;
  mostrar: boolean = false;
  public rate: any;
  public entSal:number = 0;
  public tituloEnSal:string;
  ldg:Loading = null;
  public habilitado:boolean=true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public _datos: DatosProvider,
    private auth: AuthProvider,

  ) {

    let subs: Subscription = _datos.getCantEncuestaES().subscribe((data)=> {
        this.entSal = data.length;
         
        if(this.entSal == 2)
          this.presentToast();
        else if(this.entSal == 1)
          this.tituloEnSal = "Salida";
        else
          this.tituloEnSal = "Entrada";
    });

    //Asi no queda escuchando la lista desde la base
    setTimeout(() => {
      subs.unsubscribe();
    }, 1000);

    this.menuCtrl.enable(true, 'menu');
    this.frmEncuesta = this.crearFormulario();
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Las encuestas ya fueron cargadas',
      duration: 3000
    });
    toast.present().then(()=>
      this.volverRoot()
    );

  }

  tomarFotoCliente() {
    this.mensaje = "¡Opa! Que bien saliste";
    this.tomoFoto = true;
  }

  saveData() {
    this.presentLoading('Guardando encuesta...');
    let tipoEncuesta:string;

    if(this.entSal==0) {
      tipoEncuesta = "Entrada";
    }else{
      tipoEncuesta = "Salida";
    }

    //Para que muestre el loading 1 segundo
    setTimeout(() => {
      this._datos.saveEncuestaES(tipoEncuesta,this.frmEncuesta.value.estado,
        this.frmEncuesta.value.elementos,this.frmEncuesta.value.banio,
        this.frmEncuesta.value.cocina,this.frmEncuesta.value.comedor1,
        this.frmEncuesta.value.comedor2,this.frmEncuesta.value.comedor3).then( () => {
          this.ldg.dismiss().then( ()=>
            this.volverRoot()
          );
      });
    }, 1000);

  }

  volverRoot(){
    this.navCtrl.setRoot(this.auth.buscarDestino(localStorage.getItem("perfil")));
  }

  private crearFormulario() {
    return this.formBuilder.group({
      estado: ['', Validators.required],
      elementos: ['', Validators.required],
      banio: ['', Validators.required],
      cocina: ['', Validators.required],
      comedor1:['false'],
      comedor2:['false'],
      comedor3:['false']
    });

  }

  presentLoading(mensaje:string) {
    this.ldg = this.loadingCtrl.create({
      spinner:'dots',
      content: mensaje
    });

    this.ldg.present();
  }

  ionViewWillLeave(){
    if(this.ldg != null)
        this.ldg.dismiss();
  }

  // mostrarCamara() {

  //   let popoverOptions: CameraPopoverOptions = {
  //     x: 0,
  //     y: 0,
  //     width: 800,
  //     height: 800,
  //     arrowDir: this.camera.PopoverArrowDirection.ARROW_DOWN
  //   };

  //   const options: CameraOptions = {
  //     quality: 40,
  //     targetWidth: 800,
  //     targetHeight: 800,
  //     allowEdit: false,
  //     correctOrientation: true,
  //     saveToPhotoAlbum: false,
  //     cameraDirection: this.camera.Direction.BACK,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }

  // }
  // onModelChange(e: any) {
  //   console.log(e);
  // }




}
