export class FacturaProveedorDTO {
    idFacturaCompra : number;
    facturaNumero : string;
    fecha : string;
    proveedor : string;
    total : number;
    vencida : boolean;
    pagada : boolean;
    fechaPago : string;
    tipoPago : string;
}