import { UsuarioService } from './../../../../_service/usuario.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioRolDTO } from './../../../../_model/dto/usuarioRolDTO';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialogo-eliminar-usuario',
  templateUrl: './dialogo-eliminar-usuario.component.html',
  styleUrls: ['./dialogo-eliminar-usuario.component.css']
})
export class DialogoEliminarUsuarioComponent implements OnInit {

  usuarioDto : UsuarioRolDTO;

  constructor(
    private dialogRef : MatDialogRef<DialogoEliminarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) private data : UsuarioRolDTO,
    private usuarioService : UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioDto = this.data;
  }

  eliminar() {
    this.usuarioService.delete(this.usuarioDto.idUsuario).subscribe(() => {
      this.dialogRef.close(1);
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

}
