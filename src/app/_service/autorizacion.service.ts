import { environment } from './../../environments/environment';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Autorizacion } from '../_model/autorizacion';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionService extends GenericService<Autorizacion> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/autorizaciones`);
  }

  getByResponsable(idResponsable : number) {
    return this.http.get<Autorizacion[]>(`${this.url}/responsable/${idResponsable}`);
  }

  getByAutorizado(idAutorizado : number) {
    return this.http.get<Autorizacion[]>(`${this.url}/autorizado/${idAutorizado}`);
  }

  enableOrderEdit(autorizacion: Autorizacion, idServicio : number) {
    return this.http.post(`${this.url}/habilitar-edicion/servicio/${idServicio}`, autorizacion);
  }

  cancelOrderInvoice(autorizacion: Autorizacion, idServicio : number) {
    return this.http.post(`${this.url}/anular-factura/servicio/${idServicio}`, autorizacion);
  }

  editInvoiceNumber(autorizacion: Autorizacion, idServicio : number, numero: string) {
    return this.http.post(`${this.url}/cambiar-numero-factura/servicio/${idServicio}/numero/${numero}`, autorizacion);
  }

  editCustomerOrderAndCredit(autorizacion: Autorizacion, idServicio : number, idSegmento: number) {
    return this.http.post(`${this.url}/cambiar-segmento/servicio/${idServicio}/segmento/${idSegmento}`, autorizacion);
  }

}