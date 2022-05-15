import { InventarioService } from './../../../_service/inventario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-cuadrar-password-dialogo',
  templateUrl: './cuadrar-password-dialogo.component.html',
  styleUrls: ['./cuadrar-password-dialogo.component.css']
})
export class CuadrarPasswordDialogoComponent implements OnInit {

  passwordEncuadre : string = ''

  constructor(
    private inventarioService : InventarioService,
    private dialogRef : MatDialogRef<CuadrarPasswordDialogoComponent>,
    private snackBar : MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  cuadrarInventariosRepuestos() {
    if(this.passwordEncuadre!=undefined && this.passwordEncuadre!=null && this.passwordEncuadre=='proteus51829389') {
      this.spinner.show()
      this.inventarioService.cuadrarInventarioRepuestoExistencia().subscribe(data => {
        this.spinner.hide()
        this.snackBar.open(data[0], 'AVISO', {duration : 2000});
        this.cerrar()
      }, (error:any)=> this.spinner.hide())
    } else {
      this.snackBar.open('Autorización inválida', 'AVISO', {duration : 2000});
      this.cerrar()
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

}
