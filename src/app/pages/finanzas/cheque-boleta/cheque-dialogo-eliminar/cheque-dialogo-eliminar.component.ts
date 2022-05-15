import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChequeService } from './../../../../_service/cheque.service';
import { Cheque } from './../../../../_model/cheque';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-cheque-dialogo-eliminar',
  templateUrl: './cheque-dialogo-eliminar.component.html',
  styleUrls: ['./cheque-dialogo-eliminar.component.css']
})
export class ChequeDialogoEliminarComponent implements OnInit {

  cheque : Cheque;

  constructor(
    private dialogRef : MatDialogRef<ChequeDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Cheque,
    private chequeService : ChequeService
  ) { }

  ngOnInit(): void {
    this.cheque = new Cheque();
    this.cheque.idCheque = this.data.idCheque;
    this.cheque.cuentaBancaria = this.data.cuentaBancaria;
    this.cheque.numero = this.data.numero;
    this.cheque.monto = this.data.monto;
  }

  eliminar() {
    this.chequeService.delete(this.cheque.idCheque).pipe(switchMap(() => {
      return this.chequeService.getAll();
    })).subscribe(data => {
      this.chequeService.setObjetoCambio(data);
      this.chequeService.setMensajeCambio('Cheque eliminado');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
