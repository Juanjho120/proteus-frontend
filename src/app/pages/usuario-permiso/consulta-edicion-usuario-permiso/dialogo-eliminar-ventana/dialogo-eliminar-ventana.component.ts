import { VentanaRolService } from './../../../../_service/ventana-rol.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentanaRol } from './../../../../_model/ventanaRol';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialogo-eliminar-ventana',
  templateUrl: './dialogo-eliminar-ventana.component.html',
  styleUrls: ['./dialogo-eliminar-ventana.component.css']
})
export class DialogoEliminarVentanaComponent implements OnInit {

  ventanaRol : VentanaRol;

  constructor(private dialogRef : MatDialogRef<DialogoEliminarVentanaComponent>,
    @Inject(MAT_DIALOG_DATA) private data : VentanaRol,
    private ventanaRolSevice : VentanaRolService
  ) { }

  ngOnInit(): void {
    this.ventanaRol = this.data;
  }

  eliminar() {
    this.ventanaRolSevice.deleteByRolAndVentana(this.ventanaRol.rol.idRol, 
      this.ventanaRol.ventana.idVentana).subscribe(() => {
      this.dialogRef.close(1);
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

}
