import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { ComprobanteTipo } from './../_model/comprobanteTipo';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteTipoService extends GenericService<ComprobanteTipo> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/comprobante-tipos`);
  }
}
