import { IMensaje } from './../../clases/IMensaje';
import { Injectable } from '@angular/core';


import { LocalNotifications } from '@ionic-native/local-notifications';
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class PushProvider {

  constructor(
    public localNotifications: LocalNotifications,
    public afDB: AngularFireDatabase) {

    //this.obtenerUsuarios();
  }

  // private listaMensajes: IMensaje[] = [];

  setupPush(sms: IMensaje) {
    this.localNotifications.schedule({
      id: sms.id,
      title: sms.titulo,
      text: sms.texto,
      data: { mensaje: sms }
    });


    //Elimino el mensaje, una vez generado el push
    this.afDB
      .object("/mensajes/" + sms.userID + "/" + sms.id).remove().then();
  }

  //**Guarda el mensaje a enviar */
  guardarMensaje(userID: string, mensaje: IMensaje) {
    return this.afDB
      .object("/mensajes/" + userID + "/" + mensaje.id)
      .update(mensaje);
  }

  //**Me subscribo a los mensajes de un usuario en particular. Si encuentra mensajes creo el PUSH */
  public escucharMensajes(userID: string) {
    return this.afDB.list<IMensaje>('mensajes/' + userID).valueChanges().subscribe((mensajes: IMensaje[]) => {

      for (let i = 0; i < mensajes.length; i++) {
        this.setupPush(mensajes[i]);
      }
    })
  }
}
