import { ICliente } from './../../../clases/ICliente';
import { UtilProvider } from './../../../providers/util/util';
import { LoginPage } from '../../login/login';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  LoadingController,
  MenuController,
  Loading
} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteProvider } from '../../../providers/cliente/cliente';

@IonicPage()
@Component({
  selector: 'page-alta-cliente',
  templateUrl: 'alta-cliente.html'
})
export class AltaClientePage {
  anonimo: string = '';
  mensaje: string = '';
  imagenTomada: string = 'assets/imgs/calavera.png';
  registroAnonimo: Boolean;
  tomoFoto: Boolean = false;
  public formGroup: FormGroup;
  titulo: string = '';
  tipoFoto: string;
  mostrar: boolean = false;
  ldg: Loading = null;
  vieneDeComanda: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public util: UtilProvider,
    public _cliente: ClienteProvider,
    params: NavParams
  ) {
    this.menuCtrl.enable(true, 'menu');

    if (params.get('comanda') != null) {
      this.vieneDeComanda = true;
    }

    this.formGroup = this.crearFormulario();
  }

  dismiss() {
    let data = {
      nombre: this.formGroup.value.nombre,
      apellido: this.formGroup.value.apellido,
      dni: this.formGroup.value.numeroDocu
    };
    
    this.viewCtrl.dismiss(data);
  }

  saveData() {
    this.presentLoading('Guardando cliente...');

    let cliente: ICliente = {
      nombre: this.formGroup.value.nombre,
      apellido: this.formGroup.value.apellido,
      email: this.formGroup.value.email,
      tipoDocu: this.formGroup.value.tipoDocu,
      numeroDocu: this.formGroup.value.numeroDocu
    };

    setTimeout(() => {
      if(localStorage.getItem('perfil') === null){
        this._cliente
          .saveCliente(cliente)
          .then(() =>{
            this.ldg.dismiss();
            this.navCtrl.setRoot(LoginPage);
          }).catch(err => {
            this.ldg.dismiss().then(()=>{
              this.util.mostrarMensaje(err);
            })
          });
          
      }
      else{
        this._cliente
        .saveCliente(cliente)
        .then(() => {
          this.ldg.dismiss().then(() => {
            if (this.vieneDeComanda) {
              this.dismiss();
            } else {
              this.util.volverRoot();
            }
          });
        })
        .catch(err => {
          this.ldg.dismiss().then(()=>{
            this.util.mostrarMensaje(err);
          })
        });
      }
    }, 1000);
  }

  presentLoading(mensaje: string) {
    this.ldg = this.loadingCtrl.create({
      spinner: 'dots',
      content: mensaje
    });
    this.ldg.present();
  }

  private crearFormulario() {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      tipoDocu: ['DNI', Validators.required],
      numeroDocu: ['', Validators.required]
    });
  }
}
