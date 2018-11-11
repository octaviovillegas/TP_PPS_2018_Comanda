import { Component, Input } from "@angular/core";

@Component({
  selector: "pedido-pendiente",
  templateUrl: "pedido-pendiente.html"
})
export class PedidoPendienteComponent {
  @Input() public itemPedido: any;

  constructor() {
    this.itemPedido = {};
  }

  MostrarDatosConsola() {
    console.log(this.itemPedido);
  }

  DerivarSubpedido() {
    console.log('Derivar subpedido');
  }
}
