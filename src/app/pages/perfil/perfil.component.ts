import { PasswordDTO } from './../../_model/dto/passwordDTO';
import { LoginService } from './../../_service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioRolDTO } from './../../_model/dto/usuarioRolDTO';
import { UsuarioService } from './../../_service/usuario.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  form : FormGroup;
  formPasswordActual : FormGroup;
  formPasswordNuevo : FormGroup;
  usuarioDto : UsuarioRolDTO;

  constructor(
    private usuarioService : UsuarioService,
    private loginService : LoginService,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'username' : new FormControl('', Validators.required),
      'nombre' : new FormControl('', Validators.required),
      'apellido' : new FormControl('', Validators.required),
      'telefono' : new FormControl('', Validators.required),
      'email' : new FormControl('', Validators.required),
      'rol' : new FormControl('', Validators.required),
    });

    this.formPasswordActual = new FormGroup({
      'passwordActual' : new FormControl('', Validators.required)
    });

    this.formPasswordNuevo = new FormGroup({
      'passwordNuevo' : new FormControl('', Validators.required),
      'passwordNuevoR' : new FormControl('', Validators.required)
    });

    this.formPasswordNuevo.disable();
    
    this.obtenerInformacionUsuario();
  }

  obtenerInformacionUsuario() {
    this.usuarioService.getAllDTO().subscribe(data => {
      for(let usuario of data) {
        if(usuario.idUsuario==parseInt(sessionStorage.getItem('idUsuario'))) {
          this.usuarioDto = usuario;
          this.form.patchValue({
            username : this.usuarioDto.username,
            nombre : this.usuarioDto.nombre,
            apellido : this.usuarioDto.apellido,
            telefono : this.usuarioDto.telefono,
            email : this.usuarioDto.email,
            rol : this.usuarioDto.rol.nombre
          });
          this.form.get('username').disable();
          this.form.get('rol').disable();
        }
      }
    });
  }

  editar() {
    this.usuarioDto.nombre = this.form.value['nombre'];
    this.usuarioDto.apellido = this.form.value['apellido'];
    this.usuarioDto.email = this.form.value['email'];
    this.usuarioDto.telefono = this.form.value['telefono'];
    this.usuarioService.updateDto(this.usuarioDto).subscribe(() => {
      this.obtenerInformacionUsuario();
      this.snackBar.open("Se ha actualizado su información", 'AVISO', {duration : 2000});
    });
  }

  evaluarBotonVerificar() {
    if(this.formPasswordActual.enabled && this.formPasswordActual.valid) {
      return false;
    }
    return true;
  }

  evaluarBotonCambiarPassword() {
    let iguales = false;
    if(this.formPasswordNuevo.value['passwordNuevo']==this.formPasswordNuevo.value['passwordNuevoR']) {
      iguales = true;
    }

    if(this.formPasswordNuevo.enabled && this.formPasswordNuevo.valid && iguales) {
      return false;
    }
    return true;
  }

  verificarPassword() {
    let passwordDto = new PasswordDTO();
    passwordDto.password = this.formPasswordActual.value['passwordActual'];
    passwordDto.idUsuario = parseInt(sessionStorage.getItem('idUsuario'));
    this.loginService.verificarPassword(passwordDto).subscribe(data => {
      if(data!=null) {
        if(data) {
          this.formPasswordNuevo.enable();
          this.formPasswordActual.disable();
        } else {
          this.snackBar.open("Las contraseñas no coinciden", 'AVISO', {duration : 2000});
        }
      }
    });
    
  }

  cambiarPassword() {
    let passwordDto = new PasswordDTO();
    passwordDto.password = this.formPasswordNuevo.value['passwordNuevo'];
    passwordDto.idUsuario = parseInt(sessionStorage.getItem('idUsuario'));
    this.loginService.cambiarPassword(passwordDto).subscribe(data => {
      this.snackBar.open("Contraseña actualizada", 'AVISO', {duration : 2000});
      this.cancelar();
    });
  }

  cancelar() {
    this.formPasswordActual.reset();
    this.formPasswordNuevo.reset();
    this.formPasswordActual.enable();
    this.formPasswordNuevo.disable();
  }
}
