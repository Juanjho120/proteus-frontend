import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { MarcaAuto } from '../_model/marcaAuto';

@Injectable({
  providedIn: 'root'
})
export class MarcaAutoService extends GenericService<MarcaAuto> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/marcas-autos`);
  }

  createMod(marcaAuto: MarcaAuto, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, marcaAuto);
  }

  updateMod(marcaAuto: MarcaAuto, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, marcaAuto);
  }

  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }
  
}
