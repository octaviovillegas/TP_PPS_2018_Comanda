export interface IReserva {
    id: number;
    clienteId: string;
    turno: number;
    fecha: string;
    comensales: number;
    estado: string;
    mesaID?: number;
    nombreCliente:string;
    dni:string;
}