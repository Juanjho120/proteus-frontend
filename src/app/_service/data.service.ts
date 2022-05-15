import { FacturaCompraMenor } from './../_model/facturaCompraMenor';
import { Inventario } from './../_model/inventario';
import { Subject } from 'rxjs';
import { FacturaCompra } from './../_model/facturaCompra';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private facturaCompraCambio = new Subject<FacturaCompra>();

  private facturaCompraMenorCambio = new Subject<FacturaCompraMenor>();

  private inventarioCambio = new Subject<Inventario>();

  constructor() { }

  getFacturaCompraMenorCambio() {
    return this.facturaCompraMenorCambio.asObservable();
  }

  setFacturaCompraMenorCambio(facturaCompraMenor : FacturaCompraMenor) {
    this.facturaCompraMenorCambio.next(facturaCompraMenor);
  }

  getFacturaCompraCambio() {
    return this.facturaCompraCambio.asObservable();
  }

  setFacturaCompraCambio(facturaCompra : FacturaCompra) {
    this.facturaCompraCambio.next(facturaCompra);
  }

  getInventarioCambio() {
    return this.inventarioCambio.asObservable();
  }

  setInventarioCambio(inventario : Inventario) {
    this.inventarioCambio.next(inventario);
  }

}
