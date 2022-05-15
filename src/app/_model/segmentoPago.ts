import { PagoTipo } from './pagoTipo';
import { SegmentoPagoDetalle } from './segmentoPagoDetalle';
import { Sucursal } from './sucursal';
export class SegmentoPago {
    idSegmentoPago : number;
    pagoTipo : PagoTipo;
    idItem : number;
    fechaHoraPago : string;
    monto : number;
    facturas : string;
    segmentoPagoDetalle : SegmentoPagoDetalle[];
    sucursal: Sucursal;
}