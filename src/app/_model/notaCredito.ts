import { FacturaCompra } from './facturaCompra';
export class NotaCredito {
    idNotaCredito : number;
    codigo : string;
    monto : number;
    descripcion : string;
    fechaIngreso : string;
    facturaCompra : FacturaCompra;
    fechaAplicacion : string;
}