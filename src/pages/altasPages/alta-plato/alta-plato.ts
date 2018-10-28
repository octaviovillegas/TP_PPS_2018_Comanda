import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

/**
 * Generated class for the AltaPlatoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-plato',
  templateUrl: 'alta-plato.html',
})
export class AltaPlatoPage {
  @ViewChild(Slides) slides: Slides;
  ingredientes:string;
  preparacion:string;
  preparado:string;
  nombre:string;
  importe:string;
  fotoIngredientesTomada:boolean;
  fotoPreparacionTomada:boolean;
  fotoPreparadoTomada:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ingredientes = "assets/imgs/ingredientes.png";
    this.preparacion = "assets/imgs/cocinando.png";
    this.preparado = "assets/imgs/preparado.png";
    this.fotoIngredientesTomada = false;
    this.fotoPreparacionTomada = false;
    this.fotoPreparadoTomada = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaPlatoPage');
  }

  public siguiente(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
  }
  onIonDrag(event){
    this.slides.lockSwipes(true);
  }

  public anterior(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
  }

  public fotoIngredientes(){
    this.fotoIngredientesTomada = true;
  }

  public fotoPreparacion(){
    this.fotoPreparacionTomada = true;
  }
  public fotoPreparado(){
    this.fotoPreparadoTomada = true;
  }

}
