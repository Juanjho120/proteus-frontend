import { GenericService } from './generic.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChecklistDetalle } from './../_model/checklistDetalle';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChecklistDetalleService extends GenericService<ChecklistDetalle> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/checklist-detalles`);
  }

  createByChecklistTipo(idChecklistTipo : number) {
    return this.http.get<ChecklistDetalle[]>(`${this.url}/checklist-tipo/${idChecklistTipo}`);
  }
  
}
