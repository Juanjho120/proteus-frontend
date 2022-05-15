import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModificacionDTO } from './../../../_model/dto/modificacionDTO';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-detalle-eliminacion-dialogo',
  templateUrl: './detalle-eliminacion-dialogo.component.html',
  styleUrls: ['./detalle-eliminacion-dialogo.component.css']
})
export class DetalleEliminacionDialogoComponent implements OnInit {

  modificacionDTO : ModificacionDTO = new ModificacionDTO();

  constructor(
    private dialogRef : MatDialogRef<DetalleEliminacionDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : ModificacionDTO
  ) { }

  ngOnInit(): void {
    this.modificacionDTO = this.data;
  }

}
