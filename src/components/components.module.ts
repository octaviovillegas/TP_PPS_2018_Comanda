import { IonicModule } from "ionic-angular";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuComponent } from "./menu/menu";
import { PedidoPendienteComponent } from "./pedido-pendiente/pedido-pendiente";
import { PedidoCocinaComponent } from "./pedido-cocina/pedido-cocina";
import { ReservaItemComponent } from './reserva-item/reserva-item';

@NgModule({
  declarations: [MenuComponent, PedidoPendienteComponent, PedidoCocinaComponent,
    ReservaItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [MenuComponent, PedidoPendienteComponent, PedidoCocinaComponent,
    ReservaItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
