import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialogo-username',
  templateUrl: './dialogo-username.component.html',
  styleUrls: ['./dialogo-username.component.css']
})
export class DialogoUsernameComponent implements OnInit {

  username : string = "";

  constructor(
    private dialogRef : MatDialogRef<DialogoUsernameComponent>,
    @Inject(MAT_DIALOG_DATA) private data : string
  ) { }

  ngOnInit(): void {
    this.username = this.data;
  }

  cerrar() {
    this.dialogRef.close();
  }
  
}
