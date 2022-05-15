import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventarioService } from './../../../../_service/inventario.service';
import { Inventario } from './../../../../_model/inventario';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-inventario-dialogo-eliminar',
  templateUrl: './inventario-dialogo-eliminar.component.html',
  styleUrls: ['./inventario-dialogo-eliminar.component.css']
})
export class InventarioDialogoEliminarComponent implements OnInit {

  inventario : Inventario;

  constructor(
    private dialogRef : MatDialogRef<InventarioDialogoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Inventario,
    private inventarioService : InventarioService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.inventario = new Inventario();
    this.inventario.idInventario = this.data.idInventario;
    this.inventario.fechaHora = this.data.fechaHora;
  }

  eliminar() {
    this.spinner.show()
    this.inventarioService.delete(this.inventario.idInventario).pipe(switchMap(() =>{
      return this.inventarioService.getAll();
    })).subscribe(data => {
      this.inventarioService.setObjetoCambio(data);
      this.spinner.hide()
      this.inventarioService.setMensajeCambio('Inventario eliminado');
    });
    this.cerrar(true);
  }

  cerrar(opcion : boolean) {
    this.dialogRef.close(opcion);
  }

}
