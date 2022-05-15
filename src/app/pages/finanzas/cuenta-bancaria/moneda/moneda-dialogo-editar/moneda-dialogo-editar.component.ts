import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MonedaService } from './../../../../../_service/moneda.service';
import { Moneda } from './../../../../../_model/moneda';
import { Component, OnInit, Inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-moneda-dialogo-editar',
  templateUrl: './moneda-dialogo-editar.component.html',
  styleUrls: ['./moneda-dialogo-editar.component.css']
})
export class MonedaDialogoEditarComponent implements OnInit {

  moneda : Moneda;

  constructor(
    private dialogRef : MatDialogRef<MonedaDialogoEditarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Moneda,
    private monedaService : MonedaService
  ) { }

  ngOnInit(): void {
    this.moneda = new Moneda();
    this.moneda.idMoneda = this.data.idMoneda;
    this.moneda.simbolo = this.data.simbolo;
    this.moneda.nombre = this.data.nombre;
  }

  editar() {
    if(this.moneda != null && this.moneda.idMoneda > 0) {
      this.monedaService.update(this.moneda).pipe(switchMap(() => {
        return this.monedaService.getAll();
      })).subscribe(data => {
        this.monedaService.setObjetoCambio(data);
        this.monedaService.setMensajeCambio('Moneda actualizada');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}
