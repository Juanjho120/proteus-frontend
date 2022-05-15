import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { PersonalPuesto } from '../_model/personalPuesto';

@Injectable({
  providedIn: 'root'
})
export class PersonalPuestoService extends GenericService<PersonalPuesto> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/personal-puestos`);
  }

  createMod(personalPuesto: PersonalPuesto, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, personalPuesto);
  }

  updateMod(personalPuesto: PersonalPuesto, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, personalPuesto);
  }

  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }
  
}
