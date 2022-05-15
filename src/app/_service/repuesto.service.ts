import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Repuesto } from '../_model/repuesto';

@Injectable({
  providedIn: 'root'
})
export class RepuestoService extends GenericService<Repuesto> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/repuestos`);
  }

  createMod(repuesto: Repuesto, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, repuesto);
  }

  updateMod(repuesto : Repuesto, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, repuesto);
  }

  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }

}
