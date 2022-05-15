import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Checklist } from '../_model/checklist';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService extends GenericService<Checklist> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/checklists`);
  }

  getByServicioFinalizado(idServicio : number) {
    return this.http.get<Checklist>(`${this.url}/servicio/finalizado/${idServicio}`);
  }

  getByServicioCorrelativoFinalizado(correlativo : number) {
    return this.http.get<Checklist>(`${this.url}/servicio-correlativo/finalizado/${correlativo}`);
  }

  getByServicio(idServicio : number) {
    return this.http.get<Checklist>(`${this.url}/servicio/${idServicio}`);
  }

  getByPlacaAndServicioFinalizado(idPlaca : number, finalizado : boolean) {
    return this.http.get<Checklist[]>(`${this.url}/placa/${idPlaca}/finalizado/${finalizado}`);
  }

  getAllNotFinalizado() {
    return this.http.get<Checklist[]>(`${this.url}/not-finalizado`);
  }

  getByPlaca(idPlaca : number) {
    return this.http.get<Checklist[]>(`${this.url}/placa/${idPlaca}`);
  }

  getByChecklistServicioTipo(idChecklistServicioTipo : number) {
    return this.http.get<Checklist[]>(`${this.url}/checklist-servicio-tipo/${idChecklistServicioTipo}`);
  }

  getByMecanico(idMecanico : number) {
    return this.http.get<Checklist[]>(`${this.url}/mecanico/${idMecanico}`);
  }

  getBySupervisor(idSupervisor : number) {
    return this.http.get<Checklist[]>(`${this.url}/supervisor/${idSupervisor}`);
  }

  getByFechaIngreso(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Checklist[]>(`${this.url}/fecha-ingreso/${fechaDesde}/${fechaHasta}`);
  }

  getByFechaRevision(fechaDesde : string, fechaHasta : string) {
    return this.http.get<Checklist[]>(`${this.url}/fecha-revision/${fechaDesde}/${fechaHasta}`);
  }

  /*updateDto(checklistChecklistEvaluacionDto : ChecklistChec) {
    return this.http.put(`${this.url}/dto`, checklistChecklistEvaluacionDto);
  }*/

}
