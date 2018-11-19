import { DateTime } from "ionic-angular";
import { IComandaPedido } from "./IComandaPedido";

export interface IComanda {

    id: number;
    cliente: string;
    fechaHora: number;
    mesa: number;
    nombreCliente: string;
    fotoCliente: string;
    userID: string;
    estado:string; //ABIERTA, CERRADA
    pedidos?: IComandaPedido[];
    ClienteId:string;
    MozoId:string;
    importeTotal? : number;
    porcentajePropina? : number;
}