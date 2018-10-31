import {Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import {IPlato} from '../../clases/IPlato';
import {map} from 'rxjs/operators';
@Injectable()
export class platosProvider{

    private platoListRef = this.afDB.list<IPlato>('platos');
    constructor(public afDB: AngularFireDatabase){

    }

    guardarPlato(nuevo:IPlato){
        return this.afDB.list('platos').push({
            nombre: nuevo.nombre,
            importe: nuevo.importe,
            categoria: nuevo.categoria,
            descripcion: nuevo.descripcion,
            ingredientesFoto:nuevo.ingredientesFoto,
            preparacionFoto:nuevo.preparacionFoto,
            preparadoFoto: nuevo.preparacionFoto,
        });
    }

    obtenerPlatos(){
        return this.afDB.list<IPlato[]>('platos').snapshotChanges()
        .map(actions =>{
            return actions.map(a =>{
              const data = a.payload.val() as IPlato;
              const key = a.payload.key;
              return {key, ...data};
            })
        })
    }
}