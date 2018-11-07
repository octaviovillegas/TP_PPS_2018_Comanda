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
    return this.afDB.list<Iusuario>('usuarios').valueChanges();
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
    return this.afDB.object('usuarios')
           .set({
             apellido: guardado.apellido,
             cuil: guardado.cuil,
             dni: guardado.dni,
             email: guardado.email,
             foto: guardado.foto,
             nombre: guardado.nombre,
             perfil: guardado.perfil
           });
  }

  public errorAuth(error:any){
    let errorCode = error.code;
    let loadingError;
    if (errorCode === 'auth/invalid-email') {
      return "Mail invalido";
    }
    else if (errorCode === 'auth/email-already-in-use') {
      return "El mail ya se encuentra utilizado";
    }
    else if(errorCode === 'auth/operation-not-allowed'){
      return "el usuario no fue encontrado"
    }
    else if(errorCode === 'auth/weak-password'){
      return "La contraseña no es lo suficientemente segura"
    }
    else {
      return "Ha ocurrido un error";
    }
  }

}
