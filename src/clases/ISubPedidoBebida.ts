import { ISubPedido } from "./ISubPedido";

export interface ISubPedidoBebida extends ISubPedido {

    items: {
        cantidad:number;
        bebidaID:number;
    }[]
}