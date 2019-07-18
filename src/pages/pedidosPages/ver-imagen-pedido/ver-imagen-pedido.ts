import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  Slides,
  NavController,
  NavParams,
  Loading,
  LoadingController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-ver-imagen-pedido",
  templateUrl: "ver-imagen-pedido.html"
})
export class VerImagenPedidoPage {
  @ViewChild(Slides) slides: Slides;

  ldg: Loading = null;
  imgIngredientes: string;
  imgPreparacion: string;
  imgPreparado: string;
  public imgList = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.presentLoading("Cargando imagen...");
  }

  ionViewDidLoad() {
    this.imgIngredientes = this.navParams.get("fIngredientes").toString();
    this.imgPreparacion = this.navParams.get("fPreparacion").toString();
    this.imgPreparado = this.navParams.get("fPreparado").toString();
    this.imgList.push(
      { titulo: "INGREDIENTES", img: this.imgIngredientes },
      { titulo: "PREPARACIÓN", img: this.imgPreparacion },
      { titulo: "PRESENTACIÓN", img: this.imgPreparado }
    );
    setTimeout(() => {
      if (this.ldg != null) {
        this.ldg.dismiss();
      }
    }, 600);
  }

  presentLoading(mensaje: string) {
    this.ldg = this.loadingCtrl.create({
      spinner: "dots",
      content: mensaje
    });

    this.ldg.present();
  }
}
