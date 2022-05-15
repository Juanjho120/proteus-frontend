import { switchMap } from 'rxjs/operators';
import { BancoService } from './../../../../../_service/banco.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Banco } from './../../../../../_model/banco';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-banco-dialogo-editar',
  templateUrl: './banco-dialogo-editar.component.html',
  styleUrls: ['./banco-dialogo-editar.component.css']
})
export class BancoDialogoEditarComponent implements OnInit {

  banco : Banco;

  constructor(
    private dialogRef : MatDialogRef<BancoDialogoEditarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Banco,
    private bancoService : BancoService
  ) { }

  ngOnInit(): void {
    this.banco = new Banco();
    this.banco.idBanco = this.data.idBanco;
    this.banco.nombre = this.data.nombre;
  }

  editar() {
    if(this.banco != null && this.banco.idBanco > 0) {
      this.bancoService.update(this.banco).pipe(switchMap(() => {
        return this.bancoService.getAll();
      })).subscribe(data => {
        this.bancoService.setObjetoCambio(data);
        this.bancoService.setMensajeCambio('Banco actualizado');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
