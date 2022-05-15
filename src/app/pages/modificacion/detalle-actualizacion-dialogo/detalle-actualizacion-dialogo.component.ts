import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModificacionDTO } from './../../../_model/dto/modificacionDTO';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-detalle-actualizacion-dialogo',
  templateUrl: './detalle-actualizacion-dialogo.component.html',
  styleUrls: ['./detalle-actualizacion-dialogo.component.css']
})
export class DetalleActualizacionDialogoComponent implements OnInit {

  modificacionDTO : ModificacionDTO = new ModificacionDTO();

  constructor(
    private dialogRef : MatDialogRef<DetalleActualizacionDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ModificacionDTO
  ) { }

  ngOnInit(): void {
    this.modificacionDTO = this.data;
  }

}
