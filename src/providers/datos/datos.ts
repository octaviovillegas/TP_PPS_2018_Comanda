import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';


@Injectable()
export class DatosProvider {


  encuestaESLista: Array<any>;

  constructor(public afDB: AngularFireDatabase ) {
   
  }


  /** Obtiene la cantidad de EncuestaES por usuario y fecha del dia. */
  getCantEncuestaES():Observable<{}[]>{
    let userID:String = localStorage.getItem("userID");
    let fecha: Date = new Date();
    let fechaS:String;
    let cant:number=0;

    fechaS = fecha.getFullYear().toString() + (fecha.getMonth() + 1).toString() + fecha.getDate().toString();

    return this.afDB.list('/encuestaES/' + userID + '/' + fechaS).valueChanges();
  }

  /** Guarda la encuestaES por usuario */
  saveEncuestaES(entSal:string, estado:string,elementos:string, banio:string, cocina:string, comedor1:string, comedor2:string, comedor3:string): Promise<any> {
    let userID:String = localStorage.getItem("userID");
    let fecha: Date = new Date();
    let fechaS:String;

    fechaS = fecha.getFullYear().toString() + (fecha.getMonth() + 1).toString() + fecha.getDate().toString();


    return this.afDB.object('/encuestaES/' + userID + '/' + fechaS + '/' + entSal).update({
      entSal: entSal,
      estado: estado,
      elementos: elementos,
      banio: banio,
      cocina: cocina,
      comedor1: comedor1,
      comedor2: comedor2,
      comedor3: comedor3
    });
  }

}
