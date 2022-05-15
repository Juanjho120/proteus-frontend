import { RolVentanaDTO } from './../_model/dto/rolVentanaDTO';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { VentanaRol } from './../_model/ventanaRol';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentanaRolService extends GenericService<VentanaRol> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/ventanas-roles`);
  }

  getByUsername(username : string) {
    return this.http.get<RolVentanaDTO[]>(`${this.url}/username/${username}`);
  }

  getDefault() {
    return this.http.get<RolVentanaDTO[]>(`${this.url}/default`);
  }

  deleteByRolAndVentanaAndTablaAndPermiso(idRol : number, idVentana : number, idTabla : number, idPermiso : number) {
    return this.http.delete(`${this.url}/rol/${idRol}/ventana/${idVentana}/tabla/${idTabla}/permiso/${idPermiso}`);
  }

  deleteByRolAndVentanaAndTabla(idRol : number, idVentana : number, idTabla : number) {
    return this.http.delete(`${this.url}/rol/${idRol}/ventana/${idVentana}/tabla/${idTabla}`);
  }

  deleteByRolAndVentana(idRol : number, idVentana : number) {
    return this.http.delete(`${this.url}/rol/${idRol}/ventana/${idVentana}`);
  }

}
