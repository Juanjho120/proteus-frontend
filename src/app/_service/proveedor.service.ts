import { ProveedorDTO } from './../_model/dto/proveedorDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Proveedor } from '../_model/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService extends GenericService<Proveedor> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/proveedores`);
  }

  getAllDTO() {
    return this.http.get<ProveedorDTO[]>(`${this.url}/dto`);
  }

  getWithCredito() {
    return this.http.get<Proveedor[]>(`${this.url}/with-credito`);
  }

  createMod(proveedor: Proveedor, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, proveedor);
  }

  updateMod(proveedor: Proveedor, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, proveedor);
  }

  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }
  
}
