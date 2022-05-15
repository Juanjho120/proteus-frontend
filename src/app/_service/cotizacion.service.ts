import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Cotizacion } from '../_model/cotizacion';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService extends GenericService<Cotizacion> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/cotizaciones`);
  }

  getBySegmento(idSegmento : number) {
    return this.http.get<Cotizacion[]>(`${this.url}/segmento/${idSegmento}`);
  }

  getByFecha(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Cotizacion[]>(`${this.url}/fecha/${fechaDesde}/${fechaHasta}`);
  }

  getByUsuario(idUsuario : number) {
    return this.http.get<Cotizacion[]>(`${this.url}/usuario/${idUsuario}`);
  }
}
