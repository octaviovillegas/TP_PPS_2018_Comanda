import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "pedido-cocina",
  templateUrl: "pedido-cocina.html"
})
export class PedidoCocinaComponent {
  @Input() public itemPedido: any;
  @Input() public estado: string = "";
  @Output() public estadoCambiado: EventEmitter<any>;
  nombreEstado: string;
  perfil:string = "";

  constructor() {
    this.perfil = localStorage.getItem("perfil");
    this.itemPedido = {};
    this.estadoCambiado = new EventEmitter();
  }

  cambiarNombreBoton(): string {
    let es: string = "";

    switch (this.estado) {
      case "pendiente":
        es = "A Preparar";
        break;
      case "preparando":
        es = "Terminado";
        break;
    }

    return es;
  }

  devolverUrlImg(item: any):string {
    if(this.perfil == "Cocinero")
      return item.plato.preparadoFoto;
      else
      return item.bebida.preparadoFoto;
  }

  devolverNombre(item: any):string {
    if(this.perfil == "Cocinero")
      return item.plato.nombre;
      else
      return item.bebida.nombre;
  }

  sumarMinutos() {
    //hora actual - (derivado + tiempo)
    let derivadoMili: number = 0;
    let derivado = new Date(this.itemPedido.horaDerivado); 
    let actual = new Date().getTime();

    derivadoMili = new Date(derivado.getTime() + this.itemPedido.tiempoEstimado*60000).getTime();

    var diff =(derivadoMili - actual) / 1000;
    diff = diff / 60;


    return Math.floor(diff % 60);
    //return Math.abs(Math.round(diff));
  }

  cambiarEstado() {
    let estado: string;

    if(this.estado=="pendiente") {
      console.log("estado: En Preparacion");
      estado = "En Preparacion";
    }else{
      console.log("estado: Preparado");
      estado = "Preparado";
    }

    this.estadoCambiado.emit({ estadoPedido: estado, idComanda: this.itemPedido.comandaID, idPedido: this.itemPedido.id});
  }
}
