import { Component,  } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IonicPage, NavController, NavParams,  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../../providers/auth/auth';

/**
 * Generated class for the AltaClienteAnonimoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-cliente-anonimo',
  templateUrl: 'alta-cliente-anonimo.html',
})
export class AltaClienteAnonimoPage {
  fotoTomada: boolean;
  anonimoForm:FormGroup;
  fotoAnonimo:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    public afAuth: AuthProvider) 
  {
    this.fotoTomada = false;
    this.anonimoForm = this.formbuilder.group({
      nombre: ['', Validators.required]
    })
    this.fotoAnonimo = "assets/imgs/cliente.png";
  }

  tomarFoto(){
    this.fotoTomada = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaClienteAnonimoPage');
  }

  public subir(){
     this.afAuth.ingresoAnonimo()
     .then(data =>{
        localStorage.setItem("perfil", "Cliente");
        localStorage.setItem("userID", data.uid);
        console.log(data.uid);
     })
  }

}
