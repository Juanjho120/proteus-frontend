import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Sucursal } from '../_model/sucursal';

@Injectable({
    providedIn: 'root'
  })
  export class SucursalService extends GenericService<Sucursal> {
  
    constructor(protected http: HttpClient) {
      super(http, `${environment.HOST}/sucursales`);
    }
  
  }
  