import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Page } from 'ionic-angular/umd/navigation/nav-util';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthProvider {

  //public perfilLogueado: string;

  public perfil$ = new BehaviorSubject("");



  constructor(private afAuth: AngularFireAuth) {
    
  }

  // Registro de usuario
  registerUser(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // El usuario se ha creado correctamente.
      })
      .catch(err => Promise.reject(err))
  }

  loginUser(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => Promise.resolve(user))
      .catch(err => Promise.reject(err))
  }
  // Devuelve la session
  get Session() {
    return this.afAuth.authState;
  }
  // Logout de usuario
  logout() {
    this.afAuth.auth.signOut().then(() => {
      // hemos salido
    })
  }

  buscarPerfil():Observable<String>{
    return this.perfil$.asObservable();
  }

  buscarDestino(perfil:string):string {
    let destinoPage: string;
    
    this.perfil$.next(perfil);

    switch(perfil) {
      case 'Dueño':
      destinoPage = "MesasPage";
      break;
      
    case 'Supervisor':
      destinoPage = "MesasPage";

      break;
    case 'Cliente':
      destinoPage = "MesasPage";

      break;
    case 'Cocinero':
      destinoPage = "MesasPage";
      break;
    case 'Bartender':
      destinoPage = "MesasPage";

      break;
    case 'Mozo':
      destinoPage = "MesasPage";

      break;
    case 'Mestre':
      destinoPage = "MesasPage";

      break;
    default:
      destinoPage = "LoginPage";
      break;
    }

    return destinoPage;
  }

}
