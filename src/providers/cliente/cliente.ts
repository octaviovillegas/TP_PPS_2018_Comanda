import { Observable } from "@firebase/util";
import { AuthProvider } from "./../auth/auth";
import { ICliente } from "./../../clases/ICliente";
import { ToastController } from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from "@angular/core";

@Injectable()
export class ClienteProvider {
  constructor(
    public afDB: AngularFireDatabase,
    public toastCtrl: ToastController,
    public auth: AuthProvider
  ) {}

  /** Guarda una cliente */
  saveCliente(cliente: ICliente): Promise<any> {
    cliente.email = cliente.email.toLowerCase();
    let promesa = new Promise((resolve, reject) => {
      this.buscarEmail(cliente.email).then(existe => {
        if (existe) {
          //existe el mail
          reject("El e-mail ya existe");
        } else {
          this.auth
            .registerUser(cliente.email, cliente.password)
            .catch(() => reject("El e-mail es inválido"))
            .then(user => {
              // Si el mail no existe y es valido, guardo el CLIENTE
              // Luego de guardar el cliente, genero un usuario con los mismos datos, dandole como perfil Cliente
              this.afDB
                .list("/clientes/")
                .push(cliente)
                .then(() => {
                  this.afDB
                    .list("/usuarios/")
                    .push({
                      nombre: cliente.nombre,
                      apellido: cliente.apellido,
                      email: cliente.email,
                      cuil: cliente.numeroDocu,
                      dni: cliente.numeroDocu,
                      foto: "sin foto",
                      perfil: "Cliente"
                    })
                    .then(() => resolve());
                });
            });
        }
      });
    });

    return promesa;
  }

  buscarEmail(email: string): Promise<Boolean> {
    let promesa = new Promise<Boolean>((resolve, reject) => {
      this.afDB
        .list("/clientes/", ref => ref.orderByChild("email").equalTo(email))
        .valueChanges()
        .subscribe(
          (cli: any) => {
            if (cli.length > 0) resolve(true);
            else resolve(false);
          },
          err => {
            reject(err);
          }
        );
    });

    return promesa;
  }

  buscarDNI(dni: string): Promise<ICliente> {
    let promesa = new Promise<ICliente>((resolve, reject) => {

      this.afDB
        .list("/clientes/", ref =>
          ref
            .orderByChild("numeroDocu")
            .equalTo(dni)
            .limitToFirst(1)
        )
        .valueChanges()
        .subscribe(
          (cli: any) => {

            if (cli.length > 0) {
              resolve(cli[0]);
            } else {
              reject();
            }
          },
          err => {
            reject(err);
          }
        );
    });

    return promesa;
  }
  public buscarClienteEmail(email:string){
    return this.afDB.list<ICliente[]>('clientes', ref => ref.orderByChild("email").equalTo(email)).snapshotChanges()
    .map(actions =>{
      return actions.map(a =>{
        const data = a.payload.val() as ICliente;
        const key = a.payload.key;
        return {key, ... data};
      })
    })
    
  }

  public actualizarCliente(cliente: ICliente): Promise<Boolean> {
    let promesa = new Promise<Boolean>((resolve, reject) => {
      //Me devuelve una referencia al objeto de la lista, asi me aseguro de Updatear y no generar una nueva Comanda

      this.afDB
        .object("/clientes/" + cliente.key)
        .update(cliente)
        .then(() => resolve(true))
        .catch(err => reject(err));
    });

    return promesa;
  }
}
