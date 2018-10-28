import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuMozoPage } from './menu-mozo';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  declarations: [
    MenuMozoPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuMozoPage),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class MenuMozoPageModule {}
