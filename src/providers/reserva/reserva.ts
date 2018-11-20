import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReserva } from '../../clases/IReserva';

@Injectable()
export class ReservaProvider {

  constructor(
    public http: HttpClient,
    public afDB: AngularFireDatabase
    ) {
    console.log('Hello ReservaProvider Provider');
  }

  guardarReserva(reserva: IReserva): Promise<any> {
    return this.afDB.object(`reservas/${reserva.fecha}/${reserva.turno}/${reserva.id}`).update(reserva);
  }

}
