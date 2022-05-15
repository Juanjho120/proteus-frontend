import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { ServicioTipo } from '../_model/servicioTipo';

@Injectable({
  providedIn: 'root'
})
export class ServicioTipoService extends GenericService<ServicioTipo> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/servicio-tipos`);
   }
}
