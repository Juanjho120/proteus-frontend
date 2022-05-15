import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-autorizacion-password-dialogo',
  templateUrl: './autorizacion-password-dialogo.component.html',
  styleUrls: ['./autorizacion-password-dialogo.component.css']
})
export class AutorizacionPasswordDialogoComponent implements OnInit {

  passwordAutorizacion : string = ''

  constructor(
    private dialogRef : MatDialogRef<AutorizacionPasswordDialogoComponent>,
  ) { }

  ngOnInit(): void {
  }

  verificarPassword() {
    if(this.passwordAutorizacion!=undefined && this.passwordAutorizacion!=null && this.passwordAutorizacion=='proteus27158464') {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

}
