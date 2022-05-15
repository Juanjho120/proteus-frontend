import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { CuentaBancariaTipo } from '../_model/cuentaBancariaTipo';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaTipoService extends GenericService<CuentaBancariaTipo> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/cuenta-bancaria-tipos`)
   }
}
