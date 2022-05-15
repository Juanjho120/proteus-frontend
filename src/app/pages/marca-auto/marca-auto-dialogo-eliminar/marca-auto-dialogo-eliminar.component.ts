import { switchMap } from 'rxjs/operators';
import { MarcaAutoService } from './../../../_service/marca-auto.service';
import { MarcaAuto } from './../../../_model/marcaAuto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-marca-auto-dialogo-eliminar',
  templateUrl: './marca-auto-dialogo-eliminar.component.html',
  styleUrls: ['./marca-auto-dialogo-eliminar.component.css']
})
export class MarcaAutoDialogoEliminarComponent implements OnInit {

  marcaAuto : MarcaAuto;

  constructor(
    private dialogRef : MatDialogRef<MarcaAutoDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : MarcaAuto,
    private marcaAutoService : MarcaAutoService
  ) { }

  ngOnInit(): void {
    this.marcaAuto = new MarcaAuto();
    this.marcaAuto.idMarcaAuto = this.data.idMarcaAuto;
    this.marcaAuto.nombre = this.data.nombre;
  }

  eliminar() {
    this.marcaAutoService.deleteMod(this.marcaAuto.idMarcaAuto, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() =>{
      return this.marcaAutoService.getAll();
    })).subscribe(data => {
      this.marcaAutoService.setObjetoCambio(data);
      this.marcaAutoService.setMensajeCambio('Marca de auto eliminado');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
