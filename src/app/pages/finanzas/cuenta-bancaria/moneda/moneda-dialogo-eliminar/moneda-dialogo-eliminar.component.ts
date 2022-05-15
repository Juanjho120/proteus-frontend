import { MonedaService } from './../../../../../_service/moneda.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Moneda } from './../../../../../_model/moneda';
import { Component, OnInit, Inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-moneda-dialogo-eliminar',
  templateUrl: './moneda-dialogo-eliminar.component.html',
  styleUrls: ['./moneda-dialogo-eliminar.component.css']
})
export class MonedaDialogoEliminarComponent implements OnInit {

  moneda : Moneda;

  constructor(
    private dialogRef : MatDialogRef<MonedaDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Moneda,
    private monedaService : MonedaService
  ) { }

  ngOnInit(): void {
    this.moneda = new Moneda();
    this.moneda.idMoneda = this.data.idMoneda;
    this.moneda.nombre = this.data.nombre;
  }

  eliminar() {
    this.monedaService.delete(this.moneda.idMoneda).pipe(switchMap(() =>{
      return this.monedaService.getAll();
    })).subscribe(data => {
      this.monedaService.setObjetoCambio(data);
      this.monedaService.setMensajeCambio('Moneda eliminada');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
