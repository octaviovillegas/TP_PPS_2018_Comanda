import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "pedido-pendiente",
  templateUrl: "pedido-pendiente.html"
})
export class PedidoPendienteComponent {
  @Input() public itemPedido: any;
  @Output() public derivarPedido: EventEmitter<any>;
  @Output() public entregarPedido: EventEmitter<any>;

  constructor() {
    this.itemPedido = {};
    this.derivarPedido = new EventEmitter();
    this.entregarPedido = new EventEmitter();
  }

  MostrarDatosConsola() {
    //console.log(this.itemPedido);
  }

  cambiarEstado(estado: string, id: string) {
    // console.log("Derivar subpedido");
    // console.log(id);
    // console.log(estado);
    this.derivarPedido.emit({ estadoPedido: estado, idPedido: id});
  }

  sumarMinutos(minutos: number): Date {
    let tiempo = new Date();

    return new Date(tiempo.getTime() + minutos*60000);
  }

  entregarSubpedido(estado: string, id: string, categoria: string) {
    // console.log("Derivar subpedido");
    // console.log(id);
    // console.log(estado);
    this.entregarPedido.emit({ estadoPedido: estado, idPedido: id, categoriaSubp: categoria});
  }

}
