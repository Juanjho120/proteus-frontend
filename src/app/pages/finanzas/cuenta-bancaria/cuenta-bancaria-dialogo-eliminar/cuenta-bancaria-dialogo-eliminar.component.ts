import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CuentaBancariaService } from './../../../../_service/cuenta-bancaria.service';
import { CuentaBancaria } from './../../../../_model/cuentaBancaria';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-cuenta-bancaria-dialogo-eliminar',
  templateUrl: './cuenta-bancaria-dialogo-eliminar.component.html',
  styleUrls: ['./cuenta-bancaria-dialogo-eliminar.component.css']
})
export class CuentaBancariaDialogoEliminarComponent implements OnInit {

  cuentaBancaria : CuentaBancaria;

  constructor(
    private dialogRef : MatDialogRef<CuentaBancariaDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : CuentaBancaria,
    private cuentaBancariaService : CuentaBancariaService
  ) { }

  ngOnInit(): void {
    this.cuentaBancaria = new CuentaBancaria();
    this.cuentaBancaria.nombre = this.data.nombre;
    this.cuentaBancaria.numero = this.data.numero;
    this.cuentaBancaria.banco = this.data.banco;
    this.cuentaBancaria.idCuentaBancaria = this.data.idCuentaBancaria;
  }

  eliminar() {
    this.cuentaBancariaService.delete(this.cuentaBancaria.idCuentaBancaria).pipe(switchMap(() => {
      return this.cuentaBancariaService.getAll();
    })).subscribe(data => {
      this.cuentaBancariaService.setObjetoCambio(data);
      this.cuentaBancariaService.setMensajeCambio('Cuenta bancaria eliminada');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
