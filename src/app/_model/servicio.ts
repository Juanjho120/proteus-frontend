import { ServicioRepuesto } from './servicioRepuesto';
import { ServicioTrabajo } from './servicioTrabajo';
import { Cotizacion } from './cotizacion';
import { ServicioTipo } from './servicioTipo';
import { Placa } from './placa';
import { Segmento } from './segmento';
import { Sucursal } from './sucursal';
export class Servicio {
    idServicio : number;
    segmento : Segmento;
    placa : Placa;
    servicioTipo : ServicioTipo;
    kilometrajeRecorrido : number;
    kilometrajeProximoServicio : number;
    cotizacion : Cotizacion;
    servicioTrabajo : ServicioTrabajo[];
    servicioRepuesto : ServicioRepuesto[];
    costoTotal : number;
    fechaHora : string;
    finalizado : boolean;
    facturado : boolean;
    correlativo : number;
    sucursal: Sucursal;
}