import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {IEspera} from '../../clases/IEspera';
import { Observable } from 'rxjs';
/*
  Generated class for the EsperaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

/*
  Estados:
  -Espera
  -Asignado
*/
@Injectable()
export class EsperaProvider {

  constructor(public afDB:AngularFireDatabase) {
  }

  public ponerseEnLista(uid:string, cantidad:string){
    let fecha = this.obtenerFecha();
    let hora = this.obtenerHora();

    return this.afDB.list('listaDeEspera').push({
      estado: 'espera',
      uidCliente: uid,
      fecha:fecha,
      hora: hora,
      comensales: cantidad,
    })
  }

  public traerEnLista(){
    return this.afDB.list<IEspera[]>('listaDeEspera').snapshotChanges()
    .map(actions =>{
      return actions.map(a =>{
        const data = a.payload.val() as IEspera;
        const key = a.payload.key;
        return {key, ... data};
      })
    })
  }

  public asignarMesa(idEspera:string){
    return this.afDB.list('listaDeEspera').update(idEspera,{
      estado: 'asignado',
    });
  }

  public salirLista(idEspera:string){
    return this.afDB.list('listaDeEspera').remove(idEspera);
  }



  private obtenerFecha(){
    let hoy = new Date();
    let dia:any = hoy.getDate();
    let mes:any = hoy.getMonth() + 1;
    let año = hoy.getFullYear();

    if(dia< 10){
      dia = '0'+dia;
    }
    if(mes <10){
      mes = '0'+mes;
    }
    return (año + '/' + mes + '/' + dia);
  }

  private obtenerHora(){
    let date = new Date();
    let hora = date.getHours();
    let minutos = date.getMinutes();
    return (hora + ':' + minutos);
  }

}
