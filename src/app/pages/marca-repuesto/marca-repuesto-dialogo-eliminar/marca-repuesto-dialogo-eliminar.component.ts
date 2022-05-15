import { switchMap } from 'rxjs/operators';
import { MarcaRepuestoService } from './../../../_service/marca-repuesto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarcaRepuesto } from './../../../_model/marcaRepuesto';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-marca-repuesto-dialogo-eliminar',
  templateUrl: './marca-repuesto-dialogo-eliminar.component.html',
  styleUrls: ['./marca-repuesto-dialogo-eliminar.component.css']
})
export class MarcaRepuestoDialogoEliminarComponent implements OnInit {

  marcaRepuesto : MarcaRepuesto;

  constructor(
    private dialogRef : MatDialogRef<MarcaRepuestoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : MarcaRepuesto,
    private marcaRepuestoService : MarcaRepuestoService
  ) { }

  ngOnInit(): void {
    this.marcaRepuesto = new MarcaRepuesto();
    this.marcaRepuesto.idMarcaRepuesto = this.data.idMarcaRepuesto;
    this.marcaRepuesto.nombre = this.data.nombre;
  }

  eliminar() {
    this.marcaRepuestoService.deleteMod(this.marcaRepuesto.idMarcaRepuesto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() =>{
      return this.marcaRepuestoService.getAll();
    })).subscribe(data => {
      this.marcaRepuestoService.setObjetoCambio(data);
      this.marcaRepuestoService.setMensajeCambio('Marca de repuesto eliminado');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
