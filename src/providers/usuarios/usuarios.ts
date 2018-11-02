import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Iusuario} from '../../clases/usuario';
/*
  Generated class for the UsuariosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuariosProvider {

  constructor(public afDB:AngularFireDatabase) {
    
  }

  public obtenerUsuarios(){
    return this.afDB.list('usuarios').valueChanges();
  }

  public buscarUsuario(buscado:Iusuario){
    let usuarios:Iusuario[];
    this.afDB.list<Iusuario>('usuario').valueChanges()
    .subscribe(data =>{
      usuarios = data.filter(usuario => usuario.email == buscado.email);
      return usuarios;
    })
  }

  public guardarSupervisor(guardado: Iusuario){
    return this.afDB.list('usuarios')
           .push({
             apellido: guardado.apellido,
             cuil: guardado.cuil,
             dni: guardado.dni,
             email: guardado.email,
             foto: guardado.foto,
             nombre: guardado.nombre,
             perfil: guardado.perfil
           });
  }

}
