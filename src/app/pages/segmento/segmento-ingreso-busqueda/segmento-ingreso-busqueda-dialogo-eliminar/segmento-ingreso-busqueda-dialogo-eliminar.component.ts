import { switchMap } from 'rxjs/operators';
import { SegmentoService } from './../../../../_service/segmento.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Segmento } from './../../../../_model/segmento';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-segmento-ingreso-busqueda-dialogo-eliminar',
  templateUrl: './segmento-ingreso-busqueda-dialogo-eliminar.component.html',
  styleUrls: ['./segmento-ingreso-busqueda-dialogo-eliminar.component.css']
})
export class SegmentoIngresoBusquedaDialogoEliminarComponent implements OnInit {

  segmento : Segmento;

  constructor(
    private dialogRef : MatDialogRef<SegmentoIngresoBusquedaDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Segmento,
    private segmentoService : SegmentoService
  ) { }

  ngOnInit(): void {
    this.segmento = new Segmento();
    this.segmento.idSegmento = this.data.idSegmento;
    this.segmento.nombre = this.data.nombre;
  }

  eliminar() {
    this.segmentoService.deleteMod(this.segmento.idSegmento, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() =>{
      return this.segmentoService.getAll();
    })).subscribe(data => {
      this.segmentoService.setObjetoCambio(data);
      this.segmentoService.setMensajeCambio('Segmento eliminado');
    });
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
