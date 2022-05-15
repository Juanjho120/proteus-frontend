import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { FacturaCompraMenorDetalle } from './../_model/facturaCompraMenorDetalle';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FacturaCompraMenorDetalleService extends GenericService<FacturaCompraMenorDetalle> {

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/factura-compra-menor-detalles`);
  }

  updateCostoVenta(idFacturaCompraMenorDetalle : number, costoVenta : number) {
    return this.http.put(`${this.url}/${idFacturaCompraMenorDetalle}/costo-venta/${costoVenta}`, null);
  }
}
