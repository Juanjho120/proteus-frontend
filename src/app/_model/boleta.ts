import { Cheque } from './cheque';
import { CuentaBancaria } from './cuentaBancaria';
import { BoletaTipoDocumento } from './boletaTipoDocumento';
export class Boleta {
    idBoleta : number;
    numero : string;
    boletaTipoDocumento : BoletaTipoDocumento;
    cuentaBancaria : CuentaBancaria;
    fecha : string;
    monto : number;
    cheque : Cheque;
}