import { MesasProvider } from './../../providers/mesas/mesas';
import { IReserva } from './../../clases/IReserva';
import { Component, Input } from '@angular/core';
import { IMesa } from '../../clases/IMesa';

@Component({
  selector: 'ver-reserva-item',
  templateUrl: 'ver-reserva-item.html'
})
export class VerReservaItemComponent {

  text: string;
  @Input() public reserva: IReserva;
  public mesa: IMesa;

  constructor(private _mesa: MesasProvider) {

    setTimeout(() => {
      if (this.reserva.mesaId != null)
        _mesa.buscarMesa(this.reserva.mesaId).then((m) => this.mesa = m);
    }, 100);
  }

  buscarColor() {
    let color: string;

    switch (this.reserva.estado) {
      case "pendiente":
        color = "#ffff59";
        break;
      case "rechazada":
        color = "#EF431D";
        break;
      case "confirmada":
        color = "#85eb7c";
        break;
    }
    return color;
  }
}
