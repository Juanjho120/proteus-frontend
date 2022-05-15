import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { PagoTipo } from './../_model/pagoTipo';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoTipoService extends GenericService<PagoTipo>{

  constructor(protected http : HttpClient) {
    super(http, `${environment.HOST}/pago-tipos`);
   }
}
