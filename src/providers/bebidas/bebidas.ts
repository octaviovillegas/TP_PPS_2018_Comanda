import { IPlato } from "./../../clases/IPlato";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Injectable } from "@angular/core";
import { IComestible } from "../../clases/IComestible";
import { map } from "rxjs/operators";
@Injectable()
export class bebidasProvider {
  constructor(public afDB: AngularFireDatabase) {}

  guardarBebida(nuevo: IPlato) {
    return this.afDB.list("bebidas").push({
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
    return this.afDB.list("/bebidas/").valueChanges();
  }

  traerBebida(id: any): Promise<any> {
    console.log("ID BEBIDA A BUSCAR");
    console.log(id);
    let promesa = new Promise<any>((resolve, reject) => {
      this.afDB
        .list("/bebidas/", ref => ref.orderByChild("id").equalTo(id))
        .valueChanges()
        .subscribe(
          (bebida: any) => {
            console.log("BEBIDA ENCONTRADA");
            console.log(bebida);
            if (bebida.length > 0) resolve(bebida[0]);
            else resolve(bebida);
          },
          err => {
            reject(err);
          }
        );
    });
    return promesa;
  }
}
