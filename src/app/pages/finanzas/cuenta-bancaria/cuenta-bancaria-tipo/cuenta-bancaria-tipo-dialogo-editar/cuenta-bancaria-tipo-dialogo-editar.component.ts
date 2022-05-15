import { switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CuentaBancariaTipoService } from './../../../../../_service/cuenta-bancaria-tipo.service';
import { CuentaBancariaTipo } from './../../../../../_model/cuentaBancariaTipo';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-cuenta-bancaria-tipo-dialogo-editar',
  templateUrl: './cuenta-bancaria-tipo-dialogo-editar.component.html',
  styleUrls: ['./cuenta-bancaria-tipo-dialogo-editar.component.css']
})
export class CuentaBancariaTipoDialogoEditarComponent implements OnInit {

  cuentaBancariaTipo : CuentaBancariaTipo;

  constructor(
    private dialogRef : MatDialogRef<CuentaBancariaTipoDialogoEditarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : CuentaBancariaTipo,
    private cuentaBancariaTipoService : CuentaBancariaTipoService
  ) { }

  ngOnInit(): void {
    this.cuentaBancariaTipo = new CuentaBancariaTipo();
    this.cuentaBancariaTipo.idCuentaBancariaTipo = this.data.idCuentaBancariaTipo;
    this.cuentaBancariaTipo.nombre = this.data.nombre;
  }

  editar() {
    if(this.cuentaBancariaTipo != null && this.cuentaBancariaTipo.idCuentaBancariaTipo > 0) {
      this.cuentaBancariaTipoService.update(this.cuentaBancariaTipo).pipe(switchMap(() => {
        return this.cuentaBancariaTipoService.getAll();
      })).subscribe(data => {
        this.cuentaBancariaTipoService.setObjetoCambio(data);
        this.cuentaBancariaTipoService.setMensajeCambio('Tipo de cuenta actualizada');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
