import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  private mensajeCambio = new Subject<string>();
  private objetoCambio = new Subject<T[]>();

  constructor(
    protected http: HttpClient,
    @Inject(String) protected url: string
  ) { }

  //Metodos principales para la obtencion, modificacion y eliminacion de datos
  getAll() {
    return this.http.get<T[]>(this.url);
  }

  getById(id : number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  create(t: T) {
    return this.http.post(this.url, t);
  }

  update(t : T) {
    return this.http.put(this.url, t);
  }

  delete(id : number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  //Mensajes en los snackbar
  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje : string) {
    this.mensajeCambio.next(mensaje);
  }

  //Programacion reactiva al cambiar todo el set en la BD
  getObjetoCambio() {
    return this.objetoCambio.asObservable();
  }

  setObjetoCambio(ts : T[]) {
    this.objetoCambio.next(ts);
  }

}
