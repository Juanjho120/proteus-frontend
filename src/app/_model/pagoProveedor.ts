import { Sucursal } from './sucursal';
import { PagoProveedorDetalle } from './pagoProveedorDetalle';
import { PagoTipo } from './pagoTipo';
export class PagoProveedor {
    idPagoProveedor : number;
    pagoTipo : PagoTipo;
    idItem : number;
    monto : number;
    fechaHoraPago : string;
    observaciones : string;
    sucursal: Sucursal;
    pagoProveedorDetalle : PagoProveedorDetalle[];
}