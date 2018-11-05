import { IPlato } from "./IPlato";

export interface IPedido extends IPlato {
    idPedido: number;
    cantidad: number;
}