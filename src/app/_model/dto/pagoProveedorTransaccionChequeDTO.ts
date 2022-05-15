import { Cheque } from '../cheque';
import { Transaccion } from '../transaccion';
import { PagoProveedor } from '../pagoProveedor';
export class PagoProveedorTransaccionChequeDTO {
    pagoProveedor : PagoProveedor;
    transaccion : Transaccion;
    cheque : Cheque;
}