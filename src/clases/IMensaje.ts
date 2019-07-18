import { TipoPush } from "./EnumTipoPush";

export interface IMensaje {
    id: number;
    userID: string; //receptor del mensaje
    tipoMensaje: TipoPush;
    titulo: string;
    texto: string;
    data: any;
  }
  