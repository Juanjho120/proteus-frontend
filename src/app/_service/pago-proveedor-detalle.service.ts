import { PagoProveedorDetalle } from './../_model/pagoProveedorDetalle';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoProveedorDetalleService extends GenericService<PagoProveedorDetalle> {

  constructor(protected http : HttpClient) { 
    super(http, `${environment.HOST}/pago-proveedor-detalles`);
  }
}
