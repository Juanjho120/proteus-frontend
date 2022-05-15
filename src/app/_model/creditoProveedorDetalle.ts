import { FacturaCompra } from './facturaCompra';
import { CreditoProveedor } from './creditoProveedor';
export class CreditoProveedorDetalle {
    idCreditoProveedorDetalle : number;
    creditoProveedor : CreditoProveedor;
    facturaCompra : FacturaCompra;
    observaciones : string;
    totalCredito : number;
    totalRestante : number;
    totalPagado : number;
    acumulativo : number;
    vencida : boolean;
    pagada : boolean;
    icon : string;
}