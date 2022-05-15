import { Cheque } from './../cheque';
import { Transaccion } from './../transaccion';
import { SegmentoPago } from './../segmentoPago';
export class SegmentoPagoTransaccionChequeDTO {
    segmentoPago : SegmentoPago;
    transaccion : Transaccion;
    cheque : Cheque;
}