import { BancoService } from './../../../../../_service/banco.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Banco } from './../../../../../_model/banco';
import { Component, OnInit, Inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-banco-dialogo-eliminar',
  templateUrl: './banco-dialogo-eliminar.component.html',
  styleUrls: ['./banco-dialogo-eliminar.component.css']
})
export class BancoDialogoEliminarComponent implements OnInit {

  banco : Banco;

  constructor(
    private dialogRef : MatDialogRef<BancoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Banco,
    private bancoService : BancoService
  ) { }

  ngOnInit(): void {
    this.banco = new Banco();
    this.banco.idBanco = this.data.idBanco;
    this.banco.nombre = this.data.nombre;
  }

  eliminar() {
    this.bancoService.delete(this.banco.idBanco).pipe(switchMap(() =>{
      return this.bancoService.getAll();
    })).subscribe(data => {
      this.bancoService.setObjetoCambio(data);
      this.bancoService.setMensajeCambio('Banco eliminado');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
