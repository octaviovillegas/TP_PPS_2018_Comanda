import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaClientePage } from './reserva-cliente';
import { CalendarModule } from 'ionic3-calendar-en';

@NgModule({
  declarations: [
    ReservaClientePage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaClientePage),
    CalendarModule
  ],
})
export class ReservaClientePageModule {}
