import { AuthProvider } from './../../providers/auth/auth';
import { Nav } from 'ionic-angular';
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {

  @ViewChild(Nav) nav: Nav;
  @Output() openPage = new EventEmitter();
  @Output() cerrarSesion = new EventEmitter();

  public pages: Array<{ title: string, component: string }>;

  constructor(
    private auth: AuthProvider
  ) {

    //Me subscribo para tomar los cambios del perfil
      this.auth.buscarPerfil().subscribe(
        (valor:string)=> this.cargarPages(valor)
      );
  }

  cargarPages(perfil:string) {

    switch (perfil) {

      case 'Mozo':
        this.pages = [
          { title: 'Mesas', component: "MesasPage" },
          { title: 'Encuesta e/s', component: "EncuestaEnstradaSalidaPage" },
          { title: 'Nuevo cliente', component: "AltaClientePage" }
        ];
        break;
      //LOS SIGUIENTES MENUS HAY QUE IR ARREGLANDOLOS
      case 'Supervisor':
      case 'Dueño':
        this.pages = [
          { title: 'Reservas', component: "MesasPage" },
          { title: 'Nuevo Empleado', component: "MesasPage" },
          { title: 'Nuevo Supervisor', component: "AltaSupervisorPage" },
          { title: 'Nuevo Dueño', component:"AltaDueñoPage"},
          { title: 'Nueva Mesa', component:"AltaMesaPage"},
          { title: 'Estadisticas', component: "MesasPage" },
          { title: 'Encuesta', component: "EncuestaEnstradaSalidaPage" },
          { title: 'Encuesta supervisor', component: "EncuestaSupervisorPage" },
        ];
        break;

      case 'Cocinero':
        this.pages = [
          { title: 'Pedidos', component: "PedidosCocinaPage" },
          { title: 'Nuevo plato', component: "AltaPlatoPage"}
          
        ];
          break;
      case 'Bartender':
        this.pages = [
          { title: 'Pedidos', component: "PedidosCocinaPage" },
          { title: 'Nuevo bebida', component: "AltaBebidaPage"}
        ];
        break;

      case 'Cliente':
        this.pages = [
          { title: 'Reservar', component: "MesasPage" },
          { title: 'Hacer pedido', component: "PedidasPage" },
          { title: 'Encuesta satisfaccion', component: "EncuestaClientePage" },
          { title: 'Propina', component:'QrPropinaPage'}
        ];
        break;
    }
  }


  enviarPage(p: any) {
    this.openPage.emit(p);
  }
  salir() {
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuario');
    this.cerrarSesion.emit(LoginPage);
  }

}


