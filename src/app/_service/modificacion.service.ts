import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Modificacion } from '../_model/modificacion';

@Injectable({
  providedIn: 'root'
})
export class ModificacionService extends GenericService<Modificacion> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/modificaciones`);
  }

  getByFechaHora(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Modificacion[]>(`${this.url}/fecha-hora/${fechaDesde}/${fechaHasta}`);
  }

  getByFechaHoraAndUsuario(fechaDesde : string, fechaHasta : string, idUsuario : number) {
    return this.http.get<Modificacion[]>(`${this.url}/fecha-hora/${fechaDesde}/${fechaHasta}/usuario/${idUsuario}`);
  }

  getByUsuario(fechaDesde : string, fechaHasta : string, idUsuario : number) {
    return this.http.get<Modificacion[]>(`${this.url}/usuario/${idUsuario}`);
  }

}
