import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CajaChicaService } from './../../../../_service/caja-chica.service';
import { CajaChica } from './../../../../_model/cajaChica';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-caja-chica-dialogo-eliminar',
  templateUrl: './caja-chica-dialogo-eliminar.component.html',
  styleUrls: ['./caja-chica-dialogo-eliminar.component.css']
})
export class CajaChicaDialogoEliminarComponent implements OnInit {

  cajaChica : CajaChica;
  maxFecha : Date = new Date();
  formatoFecha : string = 'YYYY-MM-DD';

  constructor(
    private dialogRef : MatDialogRef<CajaChicaDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : CajaChica,
    private cajaChicaService : CajaChicaService
  ) { }

  ngOnInit(): void {
    this.cajaChica = new CajaChica();
    this.cajaChica.idCajaChica = this.data.idCajaChica;
    this.cajaChica.monto = this.data.monto;
    this.cajaChica.descripcion = this.data.descripcion;
  }

  eliminar() {
    this.cajaChicaService.delete(this.cajaChica.idCajaChica).pipe(switchMap(() => {
      return this.cajaChicaService.getByFechaIngreso(moment(this.maxFecha).format(this.formatoFecha), 
      moment(this.maxFecha).format(this.formatoFecha));
    })).subscribe(data => {
      this.cajaChicaService.setObjetoCambio(data);
      this.cajaChicaService.setMensajeCambio('Caja chica eliminada');
    });

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
