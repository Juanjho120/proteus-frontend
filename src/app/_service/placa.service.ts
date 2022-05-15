import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Placa } from '../_model/placa';
import { PlacaSegmentoDTO } from '../_model/dto/placaSegmentoDTO';

@Injectable({
  providedIn: 'root'
})
export class PlacaService extends GenericService<Placa> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/placas`);
  }

  getAllWithSegmentos() {
    return this.http.get<PlacaSegmentoDTO[]>(`${this.url}/con-segmentos`);
  }

  getNotInService() {
    return this.http.get<Placa[]>(`${this.url}/not-in-service`);
  }

  getInService() {
    return this.http.get<Placa[]>(`${this.url}/in-service`);
  }

  createMod(placa: Placa, idUsuario : number) {
    return this.http.post(`${this.url}/usuario/${idUsuario}`, placa);
  }

  updateMod(placa: Placa, idUsuario : number) {
    return this.http.put(`${this.url}/usuario/${idUsuario}`, placa);
  }
  
  deleteMod(id : number, idUsuario : number) {
    return this.http.delete(`${this.url}/${id}/usuario/${idUsuario}`);
  }
  
}
