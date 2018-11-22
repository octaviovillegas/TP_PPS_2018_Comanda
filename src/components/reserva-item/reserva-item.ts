import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IReserva } from '../../clases/IReserva';
import { IMesa } from '../../clases/IMesa';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { MesasProvider } from '../../providers/mesas/mesas';

/**
 * Generated class for the ReservaItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'reserva-item',
  templateUrl: 'reserva-item.html'
})
export class ReservaItemComponent {

  @Input() public reserva: IReserva;
  @Output() public rechazoReserva: EventEmitter<any>;
  @Output() public confirmoReserva: EventEmitter<any>;
  public listaMesas: IMesa[] = [];
  public mesa: IMesa;

  constructor(
    public _reserva: ReservaProvider,
    public _mesa: MesasProvider) {
    this.rechazoReserva = new EventEmitter();
    this.confirmoReserva = new EventEmitter();


    setTimeout(() => {
      this.buscarMesasLibres(this.reserva);         
    }, 1000);

  }

  ionViewWillEnter(){

  }

  ionViewDidLoad(){
   
  }


  buscarMesasLibres(reserva: IReserva) {
    this._mesa.buscarMesasLibres(reserva).subscribe((data)=>{this.listaMesas = data});
  }

  rechazarReserva() {
    this.reserva.estado = "rechazada";
    this.rechazoReserva.emit({reserva: this.reserva});
  }

  confirmarReserva() {
    this.reserva.estado = "confirmada";
    this.reserva.mesaId = this.mesa.idMesa;
    this.confirmoReserva.emit({reserva: this.reserva});
  }
}
