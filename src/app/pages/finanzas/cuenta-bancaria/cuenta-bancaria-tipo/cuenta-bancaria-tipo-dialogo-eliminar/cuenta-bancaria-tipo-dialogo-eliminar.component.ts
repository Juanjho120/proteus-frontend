import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CuentaBancariaTipoService } from './../../../../../_service/cuenta-bancaria-tipo.service';
import { CuentaBancariaTipo } from './../../../../../_model/cuentaBancariaTipo';
import { Component, OnInit, Inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-cuenta-bancaria-tipo-dialogo-eliminar',
  templateUrl: './cuenta-bancaria-tipo-dialogo-eliminar.component.html',
  styleUrls: ['./cuenta-bancaria-tipo-dialogo-eliminar.component.css']
})
export class CuentaBancariaTipoDialogoEliminarComponent implements OnInit {

  cuentaBancariaTipo : CuentaBancariaTipo;

  constructor(
    private dialogRef : MatDialogRef<CuentaBancariaTipoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : CuentaBancariaTipo,
    private cuentaBancariaTipoService : CuentaBancariaTipoService
  ) { }

  ngOnInit(): void {
    this.cuentaBancariaTipo = new CuentaBancariaTipo();
    this.cuentaBancariaTipo.idCuentaBancariaTipo = this.data.idCuentaBancariaTipo;
    this.cuentaBancariaTipo.nombre = this.data.nombre;
  }

  eliminar() {
    this.cuentaBancariaTipoService.delete(this.cuentaBancariaTipo.idCuentaBancariaTipo).pipe(switchMap(() =>{
      return this.cuentaBancariaTipoService.getAll();
    })).subscribe(data => {
      this.cuentaBancariaTipoService.setObjetoCambio(data);
      this.cuentaBancariaTipoService.setMensajeCambio('Tipo de cuenta eliminada');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
