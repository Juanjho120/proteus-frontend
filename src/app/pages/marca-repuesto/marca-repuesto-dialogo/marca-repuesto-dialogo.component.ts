import { switchMap } from 'rxjs/operators';
import { MarcaRepuestoService } from './../../../_service/marca-repuesto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarcaRepuesto } from './../../../_model/marcaRepuesto';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-marca-repuesto-dialogo',
  templateUrl: './marca-repuesto-dialogo.component.html',
  styleUrls: ['./marca-repuesto-dialogo.component.css']
})
export class MarcaRepuestoDialogoComponent implements OnInit {

  marcaRepuesto : MarcaRepuesto;

  constructor(
    private dialogRef : MatDialogRef<MarcaRepuestoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : MarcaRepuesto,
    private marcaRepuestoService : MarcaRepuestoService
  ) { }

  ngOnInit(): void {
    this.marcaRepuesto = new MarcaRepuesto();
    this.marcaRepuesto.idMarcaRepuesto = this.data.idMarcaRepuesto;
    this.marcaRepuesto.nombre = this.data.nombre;
  }

  editar() {
    this.marcaRepuesto.nombre = this.marcaRepuesto.nombre.toUpperCase();
    if(this.marcaRepuesto != null && this.marcaRepuesto.idMarcaRepuesto > 0) {
      this.marcaRepuestoService.updateMod(this.marcaRepuesto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
        return this.marcaRepuestoService.getAll();
      })).subscribe(data => {
        this.marcaRepuestoService.setObjetoCambio(data);
        this.marcaRepuestoService.setMensajeCambio('Marca de repuesto actualizado');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
