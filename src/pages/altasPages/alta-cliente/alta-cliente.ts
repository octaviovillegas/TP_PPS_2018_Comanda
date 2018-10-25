import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides,  } from 'ionic-angular';

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

  public principal(){
    this.navCtrl.pop();
  }

  tomarFotoCliente(){
    this.mensaje = "¡Opa! Que bien saliste";
    this.tomoFoto = true;
  }

}
