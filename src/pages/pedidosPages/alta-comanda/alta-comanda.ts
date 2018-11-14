import { IComandaPedido } from "./../../../clases/IComandaPedido";
import { AltaClientePage } from "./../../altasPages/alta-cliente/alta-cliente";
import { ICliente } from "./../../../clases/ICliente";
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
  DateTime,
  ModalController
} from "ionic-angular";
import { ClienteProvider } from "../../../providers/cliente/cliente";

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

  public clienteEncontrado: string = "";
  public dniABuscar: string = "";
  public nombreEncontrado: string = "";
  public apellidoEncontrado: string = "";

  public codigoQR: string = "";

  public comanda: IComanda;
  public mesa: IMesa;
  public mesaKey: string = "";
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
    public _comanda: ComandaProvider,
    public _cliente: ClienteProvider,
    public modalCtrl: ModalController
  ) {
    this.mesa = this.navParams.get("mesa");
    this.mesaKey = this.navParams.get("mesaKey");
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

  BuscarCliente() {
    this._cliente.buscarDNI(this.dniABuscar).then(
      (c: ICliente) => {
        if (c != null) {
          this.nombreEncontrado = c.nombre;
          this.apellidoEncontrado = c.apellido;
          this.clienteEncontrado = c.numeroDocu;
        } else {
          this.utilProvider.mostrarMensaje("Cliente inexistente");
        }
      },
      () => {
        this.utilProvider.mostrarMensaje("Cliente inexistente");
      }
    );
  }

  scan() {
    this.scanner.scan().then(barcodeData => {
      this.buscarMesaLibre(barcodeData.text);
    });
  }

  buscarMesaLibre(barcode: string) {
    this._mesa.items.subscribe(data => {
      let encontro: Boolean = false;

      for (let i = 0; i < data.length; i++) {
        if (data[i].codigoQr == barcode) {
          encontro = true;

          if (data[i].estado == "Libre") {
            this.mesa = data[i];
            this.mesaKey = data[i].key;
            //console.log(this.mesaKey);
            //this.codigoQR = this.mesa.codigoQr;
          } else {
            this.utilProvider.mostrarMensaje("La mesa no está Libre");
          }
          break;
        }
      }

      if (!encontro) {
        this.utilProvider.mostrarMensaje("Código QR incorrecto");
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

  nuevoCliente() {
    const modal = this.modalCtrl.create(AltaClientePage, { comanda: true });

    modal.onDidDismiss(data => {
      this.nombreEncontrado = data.nombre;
      this.apellidoEncontrado = data.apellido;
      this.clienteEncontrado = data.dni;
    });

    modal.present();
  }
  validarGuardarComanda(): string {
    if (this.mesa == null) return "Debe seleccionar una mesa";

    if (this.esAnonimo) {
      if (this.nombreCliente != "") return "";
      else return "Debe ingresar un cliente";
    } else {
      if (this.clienteEncontrado.length > 0) return "";
      else return "Debe ingresar un cliente";
    }
  }

  guardarComanda() {
    let msj: string = this.validarGuardarComanda();

    if (msj.length == 0) {
      this.utilProvider.presentLoading("Guardando Comanda...");

      this.comanda = {
        id: 0,
        cliente: "",
        fechaHora: 0,
        mesa: 0,
        nombreCliente: "",
        fotoCliente: "",
        userID: "",
        estado: "Abierta",
        ClienteId:"",
        MozoId:"",
      };

      this.comanda.fechaHora = Date.now();

      if (this.esAnonimo) {
        this.comanda.nombreCliente = this.nombreCliente;
        this.comanda.fotoCliente = this.imagen64;
      } else {
        this.comanda.cliente = this.clienteEncontrado; // DNI
        this.comanda.nombreCliente = this.nombreEncontrado;
      }

      this.comanda.mesa = this.mesa.idMesa;
      this.comanda.id = new Date().valueOf();
      this.comanda.userID = localStorage.getItem("userID");

      setTimeout(() => {
        this._comanda.saveComanda(this.comanda, this.mesa, this.mesaKey).then(
          () => {
            this.utilProvider.dismiss().then(() => {
              console.log(this.mesa.numero);
              this.navCtrl.push("PedidosPage", {
                mesa: this.mesa.numero,
                comanda: this.comanda
              });
            });
          },
          () => {
            this.utilProvider
              .dismiss()
              .then(() =>
                this.utilProvider.mostrarMensaje("Debe ingresar un cliente")
              );
          }
        );
      }, 2000);
    } else {
      this.utilProvider.mostrarMensaje(msj);
    }
  }
}
