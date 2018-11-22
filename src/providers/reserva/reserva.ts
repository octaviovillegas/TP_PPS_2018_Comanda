import { IReserva } from './../../clases/IReserva';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMesa } from '../../clases/IMesa';
//import { parseDate, DateTimeData } from 'ionic-angular/umd/util/datetime-util';

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
    return this.afDB.list<IReserva>("/reservas/", ref => ref.orderByChild('estado').equalTo('confirmada')).valueChanges();
  }


  public traerReservasXCliente(clienteID: string): Promise<IReserva[]> {
    let listaReservas: IReserva[] = [];
    let promesa = new Promise<IReserva[]>((resolve) => {
      this.afDB.list<IReserva>("/reservas/", ref => ref.orderByChild('clienteId').equalTo(clienteID))
        .valueChanges()
        .subscribe((data: IReserva[]) => {
          let hoy: Date = new Date();

          data.map((res: IReserva) => {
            let dia: string = res.fecha.substr(0, 2);
            let mes: string = res.fecha.substr(2, 2);
            let anio: string = res.fecha.substr(4, 4);
            let fecha: Date = new Date(`${mes}/${dia}/${anio} 23:59`);

            if (fecha >= hoy) {
              listaReservas.push(res);
            }
          })

          resolve(listaReservas);
        });
    });

    return promesa;
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
