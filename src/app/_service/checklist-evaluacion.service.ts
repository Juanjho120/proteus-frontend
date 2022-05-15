import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { ChecklistEvaluacion } from '../_model/checklistEvaluacion';

@Injectable({
  providedIn: 'root'
})
export class ChecklistEvaluacionService extends GenericService<ChecklistEvaluacion> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/checklist-evaluaciones`);
   }
}
