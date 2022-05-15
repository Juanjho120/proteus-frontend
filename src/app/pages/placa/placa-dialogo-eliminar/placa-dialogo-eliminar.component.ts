import { switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlacaService } from './../../../_service/placa.service';
import { Placa } from './../../../_model/placa';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-placa-dialogo-eliminar',
  templateUrl: './placa-dialogo-eliminar.component.html',
  styleUrls: ['./placa-dialogo-eliminar.component.css']
})
export class PlacaDialogoEliminarComponent implements OnInit {

  placa : Placa;

  constructor(
    private dialogRef : MatDialogRef<PlacaDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Placa,
    private placaService : PlacaService
  ) { }

  ngOnInit(): void {
    this.placa = new Placa();
    this.placa.idPlaca = this.data.idPlaca;
    this.placa.numero = this.data.numero;
  }

  eliminar() {
    this.placaService.deleteMod(this.placa.idPlaca, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() =>{
      return this.placaService.getAll();
    })).subscribe(data => {
      this.placaService.setObjetoCambio(data);
      this.placaService.setMensajeCambio('Placa eliminada');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
