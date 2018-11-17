import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentsModule } from "../../../components/components.module";
import { IonicPageModule } from "ionic-angular";
import { PedidosCocinaPage } from "./pedidos-cocina";

@NgModule({
  declarations: [PedidosCocinaPage],
  imports: [IonicPageModule.forChild(PedidosCocinaPage), ComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PedidosCocinaPageModule {}
