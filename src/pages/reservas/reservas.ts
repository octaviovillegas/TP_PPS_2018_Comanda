import { IReserva } from './../../clases/IReserva';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { IMesa } from '../../clases/IMesa';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public _reserva: ReservaProvider) {
    this.perfil = localStorage.getItem('perfil');
  }

  ionViewDidLoad() {
   this.cargarReservas(); 
  }

  cargarReservas() {
      this._reserva.traerReservasPendientes().subscribe((lista: IReserva[])=>{
        console.log(lista);
        this.reservas = lista;
      })
  }

  confirmarReserva() {

  }

  rechazarReserva() {

  }


}
