import { IPlato } from './../../clases/IPlato';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { IComestible } from '../../clases/IComestible';
import { map } from 'rxjs/operators';
@Injectable()
export class bebidasProvider {

    constructor(public afDB: AngularFireDatabase) { }

    guardarBebida(nuevo: IPlato) {
        return this.afDB.list('bebidas').push({
            id: nuevo.id,
            nombre: nuevo.nombre,
            importe: nuevo.importe,
            descripcion: nuevo.descripcion,
            ingredientesFoto: nuevo.ingredientesFoto,
            preparacionFoto: nuevo.preparacionFoto,
            preparadoFoto: nuevo.preparacionFoto,
            tiempoEstimado: nuevo.tiempoEstimado,
            categoria: nuevo.categoria
        });
    }

    traerBebidas() {
        return this.afDB.list('/bebidas/').valueChanges();
    }
}