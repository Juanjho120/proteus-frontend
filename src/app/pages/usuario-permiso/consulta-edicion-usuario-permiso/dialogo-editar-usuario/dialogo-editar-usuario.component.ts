import { RolService } from './../../../../_service/rol.service';
import { Observable } from 'rxjs';
import { Rol } from './../../../../_model/rol';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from './../../../../_service/usuario.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioRolDTO } from './../../../../_model/dto/usuarioRolDTO';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialogo-editar-usuario',
  templateUrl: './dialogo-editar-usuario.component.html',
  styleUrls: ['./dialogo-editar-usuario.component.css']
})
export class DialogoEditarUsuarioComponent implements OnInit {

  usuarioDto : UsuarioRolDTO;
  idRol : number = 0;
  estado : number = 0;
  roles$ : Observable<Rol[]>;

  form : FormGroup;

  constructor(
    private dialogRef : MatDialogRef<DialogoEditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) private data : UsuarioRolDTO,
    private usuarioService : UsuarioService,
    private rolService : RolService
  ) { }

  ngOnInit(): void {
    this.roles$ = this.rolService.getAll();

    this.usuarioDto = new UsuarioRolDTO();
    this.usuarioDto.idUsuario = this.data.idUsuario;
    this.usuarioDto.username = this.data.username;
    this.usuarioDto.nombre = this.data.nombre;
    this.usuarioDto.apellido = this.data.apellido;
    this.usuarioDto.email = this.data.email;
    this.usuarioDto.telefono = this.data.telefono;
    this.usuarioDto.estado = this.data.estado;
    this.usuarioDto.rol = this.data.rol;

    this.idRol = this.data.rol.idRol;
    this.estado = 2;
    if(this.usuarioDto.estado=='ACTIVO') {
      this.estado = 1;
    }

    this.form = new FormGroup({
      'username' : new FormControl(this.usuarioDto.username, Validators.required),
      'nombre' : new FormControl(this.usuarioDto.nombre, Validators.required),
      'apellido' : new FormControl(this.usuarioDto.apellido, Validators.required),
      'email' : new FormControl(this.usuarioDto.email, Validators.required),
      'telefono' : new FormControl(this.usuarioDto.telefono, Validators.required),
      'estado' : new FormControl(this.estado, Validators.required),
      'rol' : new FormControl(this.idRol, Validators.required),
    });

    this.form.get('username').disable();
    
  }

  editar() {
    this.usuarioDto.nombre = this.form.value['nombre'];
    this.usuarioDto.apellido = this.form.value['apellido'];
    this.usuarioDto.email = this.form.value['email'];
    this.usuarioDto.telefono = this.form.value['telefono'];
    this.usuarioDto.rol = new Rol();
    this.usuarioDto.rol.idRol = this.idRol;
    if(this.estado==1) {
      this.usuarioDto.estado = 'ACTIVO';
    } else if(this.estado==2) {
      this.usuarioDto.estado = 'INACTIVO';
    }
    this.usuarioService.updateDto(this.usuarioDto).subscribe(() => {
      this.dialogRef.close(1);
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
