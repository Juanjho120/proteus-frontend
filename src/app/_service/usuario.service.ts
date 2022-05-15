import { UsuarioRolDTO } from './../_model/dto/usuarioRolDTO';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Usuario } from '../_model/usuario';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/usuarios`);
  }

  getUsuarioByToken() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return this.http.get<Usuario>(`${this.url}/username/${decodedToken.user_name}`);
  }

  getAllDTO() {
    return this.http.get<UsuarioRolDTO[]>(`${this.url}/dto`);
  }
  
  updateDto(usuarioDto : UsuarioRolDTO) {
    return this.http.put(`${this.url}/dto`, usuarioDto);
  }

  getAllEnable() {
    return this.http.get<Usuario[]>(`${this.url}/all-enable`);
  }

}
