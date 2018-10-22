import { AltaClientePage } from '../../pages/altasPages/alta-cliente/alta-cliente';
import { EncuestaEnstradaSalidaPage } from '../../pages/encuestasPages/encuesta-enstrada-salida/encuesta-enstrada-salida';
import { EncuestaSupervisorPage } from '../../pages/encuestasPages/encuesta-supervisor/encuesta-supervisor';
import { MesasPage } from '../../pages/mesasPages/mesas/mesas';
import { Component, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {

  @Output() openPage = new EventEmitter();

  public pages: Array<{ title: string, component: any }>;
  public perfil;

  constructor() {
    console.log("CONSTRUCTOR MENU");

    this.perfil = "Mozo";

    this.cargarPages();

  }

  cargarPages() {

    switch (this.perfil) {

      case 'Mozo':
        this.pages = [
          { title: 'Mesas', component: MesasPage },
          { title: 'Encuesta e/s', component: EncuestaEnstradaSalidaPage },
          { title: 'Encuesta supervisor', component: EncuestaSupervisorPage },
          { title: 'Nuevo cliente', component: AltaClientePage }
        ];
        break;
      //LOS SIGUIENTES MENUS HAY QUE IR ARREGLANDOLOS
      case 'Supervisor':
      case 'Dueno':
        this.pages = [
          { title: 'Reservas', component: MesasPage },
          { title: 'Nuevo Empleado', component: MesasPage },
          { title: 'Nuevo Supervisor', component: MesasPage },
          { title: 'Estadisticas', component: MesasPage },
          { title: 'Encuesta', component: EncuestaEnstradaSalidaPage }
        ];
        break;

      case 'Cocinero':
      case 'Bartender':
        this.pages = [
          { title: 'Pedidos', component: MesasPage },
          { title: 'Nuevo Producto', component: EncuestaEnstradaSalidaPage },
          { title: 'Encuesta e/s', component: EncuestaEnstradaSalidaPage },
          { title: 'Encuesta supervisor', component: EncuestaSupervisorPage }
        ];
        break;

      case 'Cliente':
        this.pages = [
          { title: 'Reservar', component: MesasPage },
          { title: 'Hacer pedido', component: EncuestaEnstradaSalidaPage },
          { title: 'Encuesta satisfaccion', component: EncuestaSupervisorPage }
        ];
        break;
    }

  }


  enviarPage(p: any) {
    console.log("MENU COMPONENT");
    console.log(p);
    this.openPage.emit(p);
  }
  salir() {

  }

}
