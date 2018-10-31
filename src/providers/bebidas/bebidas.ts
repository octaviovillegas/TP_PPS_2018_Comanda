import {Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import {IComestible} from '../../clases/IComestible';
import {map} from 'rxjs/operators';
@Injectable()
export class bebidasProvider{

    private platoListRef = this.afDB.list<IComestible>('platos');
    constructor(public afDB: AngularFireDatabase){

    }

    guardarBebida(nuevo:IComestible){
        return this.afDB.list('bebidas').push({
            nombre: nuevo.nombre,
            importe: nuevo.importe,
            descripcion: nuevo.descripcion,
            ingredientesFoto:nuevo.ingredientesFoto,
            preparacionFoto:nuevo.preparacionFoto,
            preparadoFoto: nuevo.preparacionFoto,
        });
    }

    obtenerBebidas(){
        return this.afDB.list<IComestible[]>('platos').snapshotChanges()
        .map(actions =>{
            return actions.map(a =>{
              const data = a.payload.val() as IComestible;
              const key = a.payload.key;
              return {key, ...data};
            })
        })
    }
}