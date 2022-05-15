import { Proveedor } from "./proveedor";
import { Servicio } from "./servicio";
import { Usuario } from "./usuario";

export class FacturaAnulada {
    idFacturaAnulada: number;
    fechaAnulacion: string;
    proveedor: Proveedor;
    servicio: Servicio;
    codigoNumero: string;
    totalFacturado: number;
    fechaEmision: string;
    razon: string;
    responsable: Usuario;
}