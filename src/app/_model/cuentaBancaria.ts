import { Moneda } from './moneda';
import { CuentaBancariaTipo } from './cuentaBancariaTipo';
import { Banco } from './banco';
import { Categoria } from './categoria';
export class CuentaBancaria {
    idCuentaBancaria : number;
    categoria : Categoria;
    idItem : number;
    banco : Banco;
    cuentaBancariaTipo : CuentaBancariaTipo;
    moneda : Moneda;
    numero : string;
    nombre : string;
}