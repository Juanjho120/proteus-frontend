import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Permiso } from './../_model/permiso';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermisoService extends GenericService<Permiso> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/permisos`);
  }
  
}
