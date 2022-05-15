import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Ventana } from '../_model/ventana';

@Injectable({
  providedIn: 'root'
})
export class VentanaService extends GenericService<Ventana> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/ventanas`);
  }

  getByUsername(username : string) {
    return this.http.get<Ventana[]>(`${this.url}/username/${username}`);
  }
}
