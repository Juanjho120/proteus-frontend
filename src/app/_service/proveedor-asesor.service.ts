import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { ProveedorAsesor } from '../_model/proveedorAsesor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorAsesorService extends GenericService<ProveedorAsesor> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/proveedor-asesores`);
  }

  createMod(proveedorAsesor: ProveedorAsesor, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, proveedorAsesor);
  }

  updateMod(proveedorAsesor: ProveedorAsesor, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, proveedorAsesor);
  }

  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }
  
}
