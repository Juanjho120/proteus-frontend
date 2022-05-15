import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { MarcaRepuesto } from '../_model/marcaRepuesto';

@Injectable({
  providedIn: 'root'
})
export class MarcaRepuestoService extends GenericService<MarcaRepuesto> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/marcas-repuestos`);
  }

  createMod(marcaRepuesto: MarcaRepuesto, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, marcaRepuesto);
  }

  updateMod(marcaRepuesto: MarcaRepuesto, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, marcaRepuesto);
  }

  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }
  
}
