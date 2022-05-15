import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { BoletaTipoDocumento } from './../_model/boletaTipoDocumento';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoletaTipoDocumentoService extends GenericService<BoletaTipoDocumento> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/boleta-tipos-documentos`);
  }
}
