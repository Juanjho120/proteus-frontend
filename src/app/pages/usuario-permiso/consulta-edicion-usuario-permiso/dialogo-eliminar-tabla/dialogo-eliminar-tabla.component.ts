import { VentanaRolService } from './../../../../_service/ventana-rol.service';
import { VentanaRol } from './../../../../_model/ventanaRol';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialogo-eliminar-tabla',
  templateUrl: './dialogo-eliminar-tabla.component.html',
  styleUrls: ['./dialogo-eliminar-tabla.component.css']
})
export class DialogoEliminarTablaComponent implements OnInit {

  ventanaRol : VentanaRol;

  constructor(private dialogRef : MatDialogRef<DialogoEliminarTablaComponent>,
    @Inject(MAT_DIALOG_DATA) private data : VentanaRol,
    private ventanaRolSevice : VentanaRolService
  ) { }

  ngOnInit(): void {
    this.ventanaRol = this.data;
  }

  eliminar() {
    this.ventanaRolSevice.deleteByRolAndVentanaAndTabla(this.ventanaRol.rol.idRol, 
      this.ventanaRol.ventana.idVentana, this.ventanaRol.tabla.idTabla).subscribe(() => {
      this.dialogRef.close(1);
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

}
