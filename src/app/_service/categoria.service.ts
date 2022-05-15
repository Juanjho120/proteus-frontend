import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Categoria } from '../_model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends GenericService<Categoria> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/categorias`);
  }
}
