import { IReserva } from './../../clases/IReserva';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { IMesa } from '../../clases/IMesa';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the ReservasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reservas',
  templateUrl: 'reservas.html',
})
export class ReservasPage {

  public perfil: string;
  public reservas: IReserva[] = [];
  public mesa;
  public mesas: IMesa[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public _reserva: ReservaProvider,
    public _utils: UtilProvider) {
    this.perfil = localStorage.getItem('perfil');
  }

  ionViewDidLoad() {
   this.cargarReservas(); 
  }

  cargarReservas() {
      this._reserva.traerReservasPendientes().subscribe((lista: IReserva[])=>{
        this.reservas = lista;

        // for (let i = 0; i < this.reservas.length; i++) {
        //   let fecha:string = this.reservas[i].fecha;
        //   this.reservas[i].fecha = fecha.substr(0,2) + '/' + fecha.substr(2,2) + '/' + fecha.substr(4,4);
        // }
      })
  }

  confirmarReserva(event: any) {
    this._reserva.actualizarReserva(event.reserva as IReserva).then((resul)=>{

      this._utils.mostrarMensaje("Se confirmó la reserva");
    })
  }

  rechazarReserva(event: any) {
    this._reserva.actualizarReserva(event.reserva as IReserva).then((resul)=>{

      this._utils.mostrarMensaje("Se rechazó la reserva");
    })
  }


}
