import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Concepto } from '../_model/concepto';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService extends GenericService<Concepto> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/conceptos`);
   }
}
