import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FechaPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'fecha',
})
export class FechaPipe implements PipeTransform {

  transform(value: string, ...args) {
    //return value.toLowerCase();
    if(value.length == 8){
      let formateada = value.substring(0,2);
      formateada = formateada + "/" + value.substring(2,4);
      formateada = formateada + "/" + value.substring(4);
      return formateada;
    }
    else{
      return value;
    }
  }
}
