import { TransaccionEstado } from './transaccionEstado';
import { CuentaBancaria } from './cuentaBancaria';
export class Transaccion {
    idTransaccion : number;
    cuentaBancariaDestino : CuentaBancaria;
    referencia : string;
    fechaProcesamiento : string;
    fechaAprobacion : string;
    monto : number;
    transaccionEstado : TransaccionEstado;
}