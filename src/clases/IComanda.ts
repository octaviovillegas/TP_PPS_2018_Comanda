import { DateTime } from "ionic-angular";
import { IComandaPedido } from "./IComandaPedido";

export interface IComanda {

    id: number;
    cliente: number;
    fechaHora: number;
    mesa: number;
    nombreCliente: string;
    fotoCliente: string;
    userID: number;
    pedidos: IComandaPedido[];
}