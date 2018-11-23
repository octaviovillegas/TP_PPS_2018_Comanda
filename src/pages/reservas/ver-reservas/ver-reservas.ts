import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ReservaProvider } from '../../../providers/reserva/reserva';
import { IReserva } from '../../../clases/IReserva';

/**
 * Generated class for the VerReservasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver-reservas',
  templateUrl: 'ver-reservas.html',
})
export class VerReservasPage {

  public perfil: string;
  public listaReservas: IReserva[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public _reserva: ReservaProvider) {
      this.menuCtrl.enable(true, 'menu');
    this.perfil = localStorage.getItem('perfil');
  }

  ionViewDidLoad() {

    this._reserva.traerReservasXCliente(localStorage.getItem('userID')).then((lista) => {
      this.listaReservas = [];
      this.listaReservas = lista;

      this.listaReservas.sort((a, b) => {
        let dia: string = a.fecha.substr(0, 2);
        let mes: string = a.fecha.substr(2, 2);
        let anio: string = a.fecha.substr(4, 4);

        let dia2: string = b.fecha.substr(0, 2);
        let mes2: string = b.fecha.substr(2, 2);
        let anio2: string = b.fecha.substr(4, 4);

        let fecha: Date = new Date(`${mes}/${dia}/${anio}`);
        let fecha2: Date = new Date(`${mes2}/${dia2}/${anio2}`);

        if (fecha2 > fecha) return -1;
        else if (fecha > fecha2) return 1;
        else return 0;
      })
    });
  }

}
