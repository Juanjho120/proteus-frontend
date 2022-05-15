import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Servicio } from '../_model/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServicioService extends GenericService<Servicio> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/servicios`);
  }

  getNotInChecklist() {
    return this.http.get<Servicio[]>(`${this.url}/not-in-checklist`);
  }

  getByFinalizado(finalizado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/finalizado/${finalizado}`);
  }

  getByFacturado(facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/facturado/${facturado}`);
  }

  getBySucursalAndFacturado(idSucursal : number, facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/sucursal/${idSucursal}/facturado/${facturado}`);
  }

  getByFinalizadoAndFacturado(finalizado : boolean, facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/finalizado/${finalizado}/facturado/${facturado}`);
  }

  getBySegmento(idSegmento : number) {
    return this.http.get<Servicio[]>(`${this.url}/segmento/${idSegmento}`);
  }

  getBySegmentoAndSucursal(idSegmento : number, idSucursal : number) {
    return this.http.get<Servicio[]>(`${this.url}/segmento/${idSegmento}/sucursal/${idSucursal}`);
  }
  
  getBySucursal(idSucursal : number) {
    return this.http.get<Servicio[]>(`${this.url}/sucursal/${idSucursal}`);
  }

  getByFecha(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Servicio[]>(`${this.url}/fecha/${fechaDesde}/${fechaHasta}`);
  }

  getByServicioTipo(idServicioTipo : number) {
    return this.http.get<Servicio[]>(`${this.url}/servicio-tipo/${idServicioTipo}`);
  }

  getByPlaca(idPlaca : number) {
    return this.http.get<Servicio[]>(`${this.url}/placa/${idPlaca}`);
  }

  getByPlacaAndFinalizado(idPlaca : number, finalizado : boolean) {
    return this.http.get<Servicio>(`${this.url}/placa/${idPlaca}/finalizado/${finalizado}`);
  }

  getByCorrelativo(correlativo : number) {
    return this.http.get<Servicio>(`${this.url}/correlativo/${correlativo}`);
  }

  getBySegmentoAndFinalizadoAndFacturado(idSegmento : number, finalizado : boolean, facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/segmento/${idSegmento}/finalizado/${finalizado}/facturado/${facturado}`);
  }

  getBySegmentoAndSucursalAndFinalizadoAndFacturado(idSegmento : number, idSucursal : number, finalizado : boolean, facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/segmento/${idSegmento}/sucursal/${idSucursal}/finalizado/${finalizado}/facturado/${facturado}`);
  }

  getBySucursalAndFinalizadoAndFacturado(idSucursal : number, finalizado : boolean, facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/sucursal/${idSucursal}/finalizado/${finalizado}/facturado/${facturado}`);
  }

  getByFechaAndFinalizadoAndFacturado(fechaDesde : string, fechaHasta : string, finalizado : boolean, facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/fecha/${fechaDesde}/${fechaHasta}/finalizado/${finalizado}/facturado/${facturado}`);
  }

  getByServicioTipoAndFinalizadoAndFacturado(idServicioTipo : number, finalizado : boolean, facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/servicio-tipo/${idServicioTipo}/finalizado/${finalizado}/facturado/${facturado}`);
  }

  getByPlacaAndFinalizadoAndFacturado(idPlaca : number, finalizado : boolean, facturado : boolean) {
    return this.http.get<Servicio[]>(`${this.url}/placa/${idPlaca}/finalizado/${finalizado}/facturado/${facturado}`);
  }

  updateFinalizado(servicio : Servicio) {
    return this.http.put(`${this.url}/finalizado`, servicio);
  }

  createMod(servicio: Servicio, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, servicio);
  }

  updateMod(servicio: Servicio, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, servicio);
  }

  verificarPermisoFacturacion(idServicio : number) {
    return this.http.get<boolean>(`${this.url}/permiso-facturacion/${idServicio}`);
  }

}
