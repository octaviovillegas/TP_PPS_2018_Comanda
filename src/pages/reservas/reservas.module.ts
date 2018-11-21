import { ComponentsModule } from './../../components/components.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ReservaItemComponent } from './../../components/reserva-item/reserva-item';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservasPage } from './reservas';

@NgModule({
  declarations: [
    ReservasPage
  ],
  imports: [
    IonicPageModule.forChild(ReservasPage),ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservasPageModule {}
