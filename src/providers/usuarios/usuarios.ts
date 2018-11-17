import { Observable } from "rxjs";
import { AngularFireAuth } from "angularfire2/auth";
import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Iusuario } from "../../clases/usuario";
/*
  Generated class for the UsuariosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuariosProvider {
  constructor(public afDB: AngularFireDatabase) {}


  public buscarUsuario(buscado: Iusuario) {
    let usuarios: Iusuario[];
    this.afDB
      .list<Iusuario>("usuario")
      .valueChanges()
      .subscribe(data => {
        usuarios = data.filter(usuario => usuario.email == buscado.email);
        return usuarios;
      });
  }
  
  public obtenerUsuarios(){
    return this.afDB.list<Iusuario>('usuarios').valueChanges();
  }

  public buscarUsuarioxMail(email: string): Promise<Iusuario> {
    let promesa = new Promise<Iusuario>((resolve, reject) => {

      this.afDB
        .list<Iusuario>("/usuarios/", ref =>
          ref
            .orderByChild("email")
            .equalTo(email)
            .limitToFirst(1)
        )
        .valueChanges()
        .subscribe((user: Iusuario[]) => {
          if (user.length > 0) {
            resolve(user[0]);
          } else {
            reject();
          }
        });
    });

    return promesa;
  }

  public guardarSupervisor(guardado: Iusuario) {
    return this.afDB.object("usuarios").set({
      apellido: guardado.apellido,
      cuil: guardado.cuil,
      dni: guardado.dni,
      email: guardado.email,
      foto: guardado.foto,
      nombre: guardado.nombre,
      perfil: guardado.perfil
    });
  }

  public errorAuth(error: any) {
    let errorCode = error.code;
    let loadingError;
    if (errorCode === "auth/invalid-email") {
      return "Mail invalido";
    } else if (errorCode === "auth/email-already-in-use") {
      return "El mail ya se encuentra utilizado";
    } else if (errorCode === "auth/operation-not-allowed") {
      return "el usuario no fue encontrado";
    } else if (errorCode === "auth/weak-password") {
      return "La contraseña no es lo suficientemente segura";
    } else {
      return "Ha ocurrido un error";
    }
  }

  //**Busca el Nombre y Apellido del usuario, y devuelve una promesa con el string concatenado */
  buscarNombreYApellido(id: string): Promise<string> {

    return new Promise<string>((resolve,reject)=>{

      this.afDB
      .list("/usuarios/", ref => ref.orderByChild("id").equalTo(id))
      .valueChanges().subscribe((data:Iusuario[])=>{
        if(data.length > 0) { //encontro una mesa
          resolve(data[0].nombre + ' ' + data[0].apellido);
        }else{
          resolve("");
        }
      })
    })
  }
  
}
