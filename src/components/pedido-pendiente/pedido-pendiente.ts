import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "pedido-pendiente",
  templateUrl: "pedido-pendiente.html"
})
export class PedidoPendienteComponent {

  perfil:string = "";
  @Input() public itemPedido: any;
  @Output() public derivarPedido: EventEmitter<any>;
  @Output() public entregarPedido: EventEmitter<any>;
  @Output() public eliminarPedido: EventEmitter<any>;

  constructor() {
    this.perfil = localStorage.getItem("perfil");
    this.itemPedido = {};
    this.derivarPedido = new EventEmitter();
    this.entregarPedido = new EventEmitter();
    this.eliminarPedido = new EventEmitter();
  }


  ionViewWillEnter() {
   // this.perfil = localStorage.getItem("perfil");
  }

  MostrarDatosConsola() {
    //console.log(this.itemPedido);
  }

  cambiarEstado(estado: string, id: string) {
    this.derivarPedido.emit({ estadoPedido: estado, idPedido: id});
  }

  sumarMinutos(horaDerivado: number, minutos: number): Date {
    let tiempo = new Date(horaDerivado);

    return new Date(tiempo.getTime() + minutos*60000);
  }

  entregarSubpedido(estado: string, id: string, categoria: string) {
    // console.log("Derivar subpedido");
    // console.log(id);
    // console.log(estado);
    this.entregarPedido.emit({ estadoPedido: estado, idPedido: id, categoriaSubp: categoria});
  }

  quitarPedido( id: string) {
    this.eliminarPedido.emit({idPedido: id});
  }

}
