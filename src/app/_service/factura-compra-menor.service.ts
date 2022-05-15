import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { GenericService } from './generic.service';
import { FacturaCompraMenor } from './../_model/facturaCompraMenor';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FacturaCompraMenorService extends GenericService<FacturaCompraMenor> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/facturas-compras-menores`);
  }

  getByServicio(idServicio : number) {
    return this.http.get<FacturaCompraMenor[]>(`${this.url}/servicio/${idServicio}`);
  }

  getByProveedorMenor(idProveedorMenor : number) {
    return this.http.get<FacturaCompraMenor[]>(`${this.url}/proveedor-menor/${idProveedorMenor}`);
  }

  getByFecha(fechaDesde : string, fechaHasta : string) {
    return this.http.get<FacturaCompraMenor[]>(`${this.url}/fecha/${fechaDesde}/${fechaHasta}`);
  }

  getNotInCajaChica() {
    return this.http.get<FacturaCompraMenor[]>(`${this.url}/not-in-caja-chica`);
  }
  
}
