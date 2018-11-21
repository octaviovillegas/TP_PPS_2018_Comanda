import { IReserva } from './../../clases/IReserva';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMesa } from '../../clases/IMesa';

@Injectable()
export class ReservaProvider {

  constructor(
    public http: HttpClient,
    public afDB: AngularFireDatabase
  ) {
    //console.log('Hello ReservaProvider Provider');
  }


  public guardarReserva(reserva: IReserva): Promise<any> {
    //return this.afDB.object(`reservas/${reserva.fecha}/${reserva.turno}/${reserva.id}`).update(reserva);
    return this.afDB.object(`reservas/${reserva.id}`).update(reserva);
  }


  public traerReservas() {
    return this.afDB.list("/reservas/").valueChanges();
  }


  public traerReservasconKey() {
    return this.afDB.list<IReserva[]>("/reservas/").snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.val() as IReserva;
          const key = a.payload.key;
          return { key, ...data };
        })
      })
  }


  public traerReservasPorFecha(fecha: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.afDB
        .list("/mesas/", ref => ref.orderByChild("fecha").equalTo(fecha))
        .valueChanges().subscribe((data: IReserva[]) => {
          if (data.length > 0) { //encontro una mesa
            console.log(data[0].turno);
            resolve(data[0].fecha);
          } else {
            resolve("");
          }
        })
    })
  }

  public traerReservasPendientes() {
    return this.afDB.list("/reservas/", ref => ref.orderByChild('estado').equalTo('pendiente')).valueChanges();
  }

  public traerReservasConfirmadas() {
    return this.afDB.list("/reservas/", ref => ref.orderByChild('estado').equalTo('confirmada')).valueChanges();
  }

  public actualizarReserva(reserva: IReserva): Promise<Boolean> {
    let promesa = new Promise<Boolean>((resolve, reject) => {

      this.afDB
        .object("/reservas/" + reserva.id)
        .update(reserva)
        .then(() => resolve(true))
        .catch(err => reject(err));
    });

    return promesa;
  }


}
