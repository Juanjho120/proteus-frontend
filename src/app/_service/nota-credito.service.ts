import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { NotaCredito } from './../_model/notaCredito';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoService extends GenericService<NotaCredito> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/notas-credito`);
  }

  getByFacturaCompra(idFacturaCompra : number) {
    return this.http.get<NotaCredito[]>(`${this.url}/factura-compra/${idFacturaCompra}`);
  }

}
