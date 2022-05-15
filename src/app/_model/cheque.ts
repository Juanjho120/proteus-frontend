import { CuentaBancaria } from './cuentaBancaria';
export class Cheque {
    idCheque : number;
    cuentaBancaria : CuentaBancaria;
    numero : string;
    monto : number;
    fechaEmision : string;
    fechaDeposito : string;
}