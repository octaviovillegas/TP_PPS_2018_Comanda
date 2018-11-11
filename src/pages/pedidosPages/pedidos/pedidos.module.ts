import { PedidoPendienteComponent } from "./../../../components/pedido-pendiente/pedido-pendiente";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentsModule } from '../../../components/components.module';
import { IonicPageModule } from "ionic-angular";
import { PedidosPage } from "./pedidos";

@NgModule({
  declarations: [PedidosPage],
  imports: [IonicPageModule.forChild(PedidosPage), ComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PedidosPageModule {}
