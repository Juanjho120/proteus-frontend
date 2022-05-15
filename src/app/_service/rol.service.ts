import { RolGroupUsuariosDTO } from './../_model/dto/rolGroupUsuariosDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Rol } from '../_model/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/roles`);
  }

  getRolGroupUsuarios() {
    return this.http.get<RolGroupUsuariosDTO[]>(`${this.url}/group-usuarios`);
  }
  
}
