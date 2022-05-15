import { VentanaRolService } from './../../../../_service/ventana-rol.service';
import { VentanaRol } from './../../../../_model/ventanaRol';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialogo-eliminar-permiso',
  templateUrl: './dialogo-eliminar-permiso.component.html',
  styleUrls: ['./dialogo-eliminar-permiso.component.css']
})
export class DialogoEliminarPermisoComponent implements OnInit {

  ventanaRol : VentanaRol;

  constructor(
    private dialogRef : MatDialogRef<DialogoEliminarPermisoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : VentanaRol,
    private ventanaRolSevice : VentanaRolService
  ) { }

  ngOnInit(): void {
    this.ventanaRol = this.data;
  }

  eliminar() {
    this.ventanaRolSevice.deleteByRolAndVentanaAndTablaAndPermiso(this.ventanaRol.rol.idRol, 
      this.ventanaRol.ventana.idVentana, this.ventanaRol.tabla.idTabla, 
      this.ventanaRol.permiso.idPermiso).subscribe(() => {
      this.dialogRef.close(1);
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

}
