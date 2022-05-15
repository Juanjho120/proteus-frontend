import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoletaService } from './../../../../_service/boleta.service';
import { Boleta } from './../../../../_model/boleta';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-boleta-dialogo-eliminar',
  templateUrl: './boleta-dialogo-eliminar.component.html',
  styleUrls: ['./boleta-dialogo-eliminar.component.css']
})
export class BoletaDialogoEliminarComponent implements OnInit {

  boleta : Boleta;

  constructor(
    private dialogRef : MatDialogRef<BoletaDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Boleta,
    private boletaService : BoletaService
  ) { }

  ngOnInit(): void {
    this.boleta = new Boleta();
    this.boleta.idBoleta = this.data.idBoleta;
    this.boleta.cuentaBancaria = this.data.cuentaBancaria;
    this.boleta.numero = this.data.numero;
    this.boleta.monto = this.data.monto;
  }

  eliminar() {
    this.boletaService.delete(this.boleta.idBoleta).pipe(switchMap(() => {
      return this.boletaService.getAll();
    })).subscribe(data => {
      this.boletaService.setObjetoCambio(data);
      this.boletaService.setMensajeCambio('Boleta eliminada');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
