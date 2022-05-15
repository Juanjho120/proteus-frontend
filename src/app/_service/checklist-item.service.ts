import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { ChecklistItem } from '../_model/checklistItem';

@Injectable({
  providedIn: 'root'
})
export class ChecklistItemService extends GenericService<ChecklistItem> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/checklist-items`);
   }
}
