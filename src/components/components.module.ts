
import { MenuComponent } from './menu/menu';
import { IonicModule } from 'ionic-angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
	declarations: [MenuComponent],
	imports: [ CommonModule, IonicModule],
	exports: [MenuComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
