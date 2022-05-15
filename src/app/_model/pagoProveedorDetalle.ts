import { CreditoProveedorDetalle } from './creditoProveedorDetalle';
import { PagoProveedor } from './pagoProveedor';
export class PagoProveedorDetalle {
    idPagoProveedorDetalle : number;
    pagoProveedor : PagoProveedor;
    creditoProveedorDetalle : CreditoProveedorDetalle;
}