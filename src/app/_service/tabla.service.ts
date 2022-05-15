import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Tabla } from './../_model/tabla';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablaService extends GenericService<Tabla> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/tablas`);
  }

}
