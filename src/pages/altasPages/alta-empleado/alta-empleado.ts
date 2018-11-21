import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Slide } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

/**
 * Generated class for the AltaEmpleadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-empleado',
  templateUrl: 'alta-empleado.html',
})
export class AltaEmpleadoPage {
  @ViewChild(Slides) slides: Slides;
  altaEmpleadoForm1:FormGroup;
  perfil:String;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder:FormBuilder) {
    this.altaEmpleadoForm1 = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      cuil: ['', Validators.required],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaEmpleadoPage');
  }

}
