import { UtilProvider } from "./../util/util";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Injectable } from "@angular/core";
import { IPlato } from "../../clases/IPlato";
import { map } from "rxjs/operators";
@Injectable()
export class platosProvider {
  private platoListRef = this.afDB.list<IPlato>("platos");
  constructor(public afDB: AngularFireDatabase, public _utils: UtilProvider) {}

  guardarPlato(nuevo: IPlato): Promise<any> {
    //this._utils.mostrarMensaje('PLATO PROVIDER');
    // this._utils.mostrarMensaje(nuevo.nombre);
    // this._utils.mostrarMensaje(nuevo.preparacionFoto);

    
    let promesa = new Promise((resolve,reject)=>{
      this.platoListRef.push(nuevo)
      .then(()=> resolve());
    });

    //   this.afDB.list("platos").push(nuevo)
    //   .then(()=> resolve());
    // });


    // let promesa = new Promise((resolve,reject)=>{
    //   this.afDB.list("platos").push({
    //     id: nuevo.id,
    //     nombre: nuevo.nombre,
    //     importe: nuevo.importe,
    //     categoria: nuevo.categoria,
    //     descripcion: nuevo.descripcion,
    //     ingredientesFoto: nuevo.ingredientesFoto,
    //     preparacionFoto: nuevo.preparacionFoto,
    //     preparadoFoto: nuevo.preparacionFoto,
    //     tiempoEstimado: nuevo.tiempoEstimado
    //   })
    //   .then(()=> resolve());
    // });

    return promesa;
  }

  traerPlatos(categoria: string) {
    return this.afDB
      .list("/platos/", ref => ref.orderByChild("categoria").equalTo(categoria))
      .valueChanges();
  }

  traerPlato(id: any): Promise<any> {
    // console.log("ID PLATO A BUSCAR");
    // console.log(id);
    let promesa = new Promise<any>((resolve, reject) => {
      this.afDB
        .list("/platos/", ref => ref.orderByChild("id").equalTo(id))
        .valueChanges()
        .subscribe(
          (plato: any) => {
            // console.log("PLATO ENCONTRADA");
            // console.log(plato);
            if (plato.length > 0) resolve(plato[0]);
            else resolve(plato);
          },
          err => {
            reject(err);
          }
        );
    });
    return promesa;
  }
}
