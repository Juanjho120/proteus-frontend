import { DialogoUsernameComponent } from './dialogo-username/dialogo-username.component';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from './../../../_model/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from './../../../_service/usuario.service';
import { RolService } from './../../../_service/rol.service';
import { Observable } from 'rxjs';
import { Rol } from './../../../_model/rol';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.css']
})
export class CreacionUsuarioComponent implements OnInit {

  formUsuario : FormGroup;

  roles$ : Observable<Rol[]>;

  idRol : number = 0;

  constructor(
    private usuarioService : UsuarioService,
    private rolService : RolService,
    private dialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.roles$ = this.rolService.getAll();

    this.formUsuario = new FormGroup({
      'nombre' : new FormControl('', Validators.required),
      'apellido' : new FormControl('', Validators.required),
      'telefono' : new FormControl('', Validators.required),
      'email' : new FormControl('', Validators.required),
      'rol' : new FormControl('', Validators.required),
      'password' : new FormControl('', Validators.required),
      'passwordR' : new FormControl('', Validators.required),
    });
  }

  crearUsuario() {
    let usuario = new Usuario();
    usuario.nombre = this.formUsuario.value['nombre'];
    usuario.apellido = this.formUsuario.value['apellido'];
    usuario.telefono = this.formUsuario.value['telefono'];
    usuario.email = this.formUsuario.value['email'];
    usuario.password = this.formUsuario.value['password'];
    usuario.enable = true;
    usuario.roles = [];
    let rol = new Rol();
    rol.idRol = this.idRol;
    usuario.roles.push(rol);

    this.usuarioService.create(usuario).subscribe((dataU : Usuario) => {
      if(dataU!=null) {
        console.log(dataU);
        this.limpiarFormUsuario();
        this.dialog.open(DialogoUsernameComponent, {
          width : '350px',
          data : dataU.username
        });
      }
    });
  }

  evaluarCrearUsuarioBoton() {
    if(this.formUsuario.valid && this.formUsuario.value['password']==this.formUsuario.value['passwordR']) {
      return false;
    }
    return true;
  }

  limpiarFormUsuario() {
    this.idRol = 0;
    this.formUsuario.reset();
  }

}
