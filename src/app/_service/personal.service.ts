import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Personal } from '../_model/personal';

@Injectable({
  providedIn: 'root'
})
export class PersonalService extends GenericService<Personal> {

  constructor(protected http : HttpClient) {
    super(http, `${environment.HOST}/personal`);
  }

  getByPersonalPuesto(idPersonalPuesto : number) {
    return this.http.get<Personal[]>(`${this.url}/puesto/${idPersonalPuesto}`);
  }

  createMod(personal: Personal, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, personal);
  }

  updateMod(personal: Personal, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, personal);
  }

  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }

}
