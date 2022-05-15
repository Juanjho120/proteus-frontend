import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { ChecklistServicioTipo } from '../_model/checklistServicioTipo';

@Injectable({
  providedIn: 'root'
})
export class ChecklistServicioTipoService extends GenericService<ChecklistServicioTipo> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/checklist-servicio-tipos`);
   }
}
