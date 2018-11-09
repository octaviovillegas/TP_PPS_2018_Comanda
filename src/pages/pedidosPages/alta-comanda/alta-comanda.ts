import { ComandaProvider } from "./../../../providers/comanda/comanda";
import { MesasProvider } from "./../../../providers/mesas/mesas";
import { IComanda } from "./../../../clases/IComanda";
import {
  CameraPopoverOptions,
  Camera,
  CameraOptions
} from "@ionic-native/camera";
import { UtilProvider } from "./../../../providers/util/util";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { IMesa } from "./../../../clases/IMesa";
import { Component, setTestabilityGetter } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ToastController,
  DateTime
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-alta-comanda",
  templateUrl: "alta-comanda.html"
})
export class AltaComandaPage {
  public esAnonimo: boolean = true;

  public nombreCliente: string = "";
  public imagenPreview: string = "";
  public imagen64: string = "";

  public clienteEncontrado: number = 0;
  public clienteABuscar: string = "";
  public nombreEncontrado: string = "";
  public apellidoEncontrado: string = "";

  public codigoQR: string = "";

  public comanda: IComanda;
  public mesa: IMesa;
  // public cliente: ICliente;

  constructor(
    public navCtrl: NavController,
    public scanner: BarcodeScanner,
    public navParams: NavParams,
    private platform: Platform,
    public utilProvider: UtilProvider,
    private camera: Camera,
    private _mesa: MesasProvider,
    public toastCtrl: ToastController,
    public _comanda: ComandaProvider
  ) {}

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
      };

      this.camera.getPicture(options).then(
        imageData => {
          this.imagenPreview = "data:image/jpeg;base64," + imageData;
          this.imagen64 = imageData;
        },
        err => {
          // Handle error
          this.utilProvider.mostrarMensaje(
            "Error en la cámara:" + JSON.stringify(err)
          );
        }
      );
    }
  }

  BuscarCliente() {}

  scan() {
    this.scanner.scan().then(barcodeData => {
      this.codigoQR = barcodeData.text;
      this.buscarMesa();
    });
  }

  buscarMesa() {
    this._mesa.buscarMesa(this.codigoQR).subscribe(m => {
      if (m != null) {
        this.mesa = m[0] as IMesa;
      } else {
        this.utilProvider.mostrarMensaje("Código incorrecto");
      }
    });
  }

  // mostrarMensaje(mensaje: string) {
  //   const toast = this.toastCtrl.create({
  //     message: mensaje,
  //     duration: 3000
  //   });

  //   toast.present();
  // }

  validarGuardarComanda(): boolean {
    if (this.esAnonimo) {
      if (this.nombreCliente != "") {
        return false;
      }
    } else {
      if (this.clienteEncontrado > 0) return true;
      else return false;
    }
  }

  guardarComanda() {
    if (this.validarGuardarComanda) {
      this.comanda.fechaHora = Date.now();

      if (this.esAnonimo) {
        this.comanda.nombreCliente = this.nombreCliente;
        this.comanda.fotoCliente = this.imagen64;
      } else {
        this.comanda.cliente = this.clienteEncontrado;
      }

      this.comanda.mesa = this.mesa.idMesa;
      this.comanda.id = new Date().valueOf();
      this.comanda.userID = parseInt(localStorage.getItem("userID"));

      this.utilProvider.presentLoading("Guardando Comanda...");

      setTimeout(() => {
        this._comanda.saveComanda(this.comanda).then(() => {
          this.utilProvider.dismiss().then(() => {

            // this.utilProvider.volverRoot();
            this.navCtrl.push("PedidoPage", { mesa: this.mesa.numero});
          });
        });
      }, 2000);
    } else {
      this.utilProvider.mostrarMensaje("Debe ingresar un cliente");
    }
  }
}
