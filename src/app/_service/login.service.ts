import { PasswordDTO } from './../_model/dto/passwordDTO';
import { RolVentanaDTO } from './../_model/dto/rolVentanaDTO';
import { Router } from '@angular/router';
import { Ventana } from './../_model/ventana';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url : string = `${environment.HOST}/oauth/token`;
  
  private ventanaCambio = new Subject<Ventana[]>();
  private rolVentanaCambio : RolVentanaDTO[] = [];
  private username = new Subject<string>();

  constructor(
    private http : HttpClient,
    private router : Router
  ) { }

  login(username : string, password : string) {
    const body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

  getVentanaCambio() {
    return this.ventanaCambio.asObservable();
  }

  setVentanaCambio(ventanas : Ventana[]) {
    this.ventanaCambio.next(ventanas);
  }

  getRolVentanaCambio() {
    return this.rolVentanaCambio;
  }

  setRolVentanaCambio(rolVentanas : RolVentanaDTO[]) {
    this.rolVentanaCambio = rolVentanas;
  }

  getUsername() {
    return this.username.asObservable();
  }

  setUsername(username : string) {
    this.username.next(username);
  }

  estaLogueado() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    if(token) {
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
        this.ventanaCambio.next([]);
        this.router.navigate(['login']);
      });
    } else {
      sessionStorage.clear();
      this.ventanaCambio.next([]);
      this.router.navigate(['login']);
    }
  }

  enviarCorreo(correo : string) {
    return this.http.post<number>(`${environment.HOST}/login/enviarCorreo`, correo, {
      headers : new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  verificarTokenReset(token: string) {
    return this.http.get<number>(`${environment.HOST}/login/restablecer/verificar/${token}`);
  }

  restablecer(token : string, clave : string) {
    return this.http.post(`${environment.HOST}/login/restablecer/${token}`, clave, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  verificarPassword(passwordDto : PasswordDTO) {
    return this.http.post(`${environment.HOST}/login/verificar-password`, passwordDto);
  }

  cambiarPassword(passwordDto : PasswordDTO) {
    return this.http.put(`${environment.HOST}/login/cambiar-password`, passwordDto);
  }

  tienePermiso(idVentana : number, idTabla : number, idPermiso : number) {
    let res : boolean = false;
    if(sessionStorage.getItem(environment.PERMISOS_NAME)==null) {
      this.cerrarSesion();
    }
    this.rolVentanaCambio = JSON.parse(sessionStorage.getItem(environment.PERMISOS_NAME));
    for(let rolVentana of this.getRolVentanaCambio()) {
      for(let ventana of rolVentana.ventanas) {
        if(ventana.idVentana==idVentana) {
          for(let tabla of ventana.tablas) {
            if(tabla.idTabla==idTabla) {
              for(let permiso of tabla.permisos) {
                if(permiso.idPermiso==idPermiso) {
                  res = true;
                }
              }
            }
          }
        }
      }
    }
    return res;
  }

}
