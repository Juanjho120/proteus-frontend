import { VentanaRolService } from './../../_service/ventana-rol.service';
import { UsuarioService } from './../../_service/usuario.service';
import { VentanaService } from './../../_service/ventana.service';
import { environment } from './../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from './../../_service/login.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin : FormGroup;

  constructor(
    private router : Router,
    private loginService : LoginService,
    private ventanaService : VentanaService,
    private ventanaRolService : VentanaRolService,
    private usuarioService : UsuarioService,
    private snackBar : MatSnackBar,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      'username' : new FormControl('', Validators.required),
      'password' : new FormControl('', Validators.required)
    });
  }

  login() {
    this.loginService.login(this.formLogin.value['username'], this.formLogin.value['password']).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);

      this.usuarioService.getUsuarioByToken().subscribe(data => {
        sessionStorage.setItem('idUsuario', data.idUsuario.toString());
        sessionStorage.setItem(environment.COMPLETE_NAME, `${data.nombre.toString()} ${data.apellido.toString()}`)
        this.loginService.setUsername(`${data.nombre} ${data.apellido}`);
      });

      const helper = new JwtHelperService();

      let decodedToken = helper.decodeToken(data.access_token);

      this.ventanaRolService.getByUsername(decodedToken.user_name).subscribe(data => {
        this.loginService.setRolVentanaCambio(data);
        sessionStorage.setItem(environment.PERMISOS_NAME, JSON.stringify(data)); //GUARDA LOS PERMISOS EN EL SESSION STORAGE
        this.ventanaService.getByUsername(decodedToken.user_name).subscribe(data => {
          this.loginService.setVentanaCambio(data);
          this.router.navigate(['inicio']);
        });
      });

    });
  }

  enviarCorreoPassword() {
    this.snackBar.open('Se ha enviado un password a su correo', 'AVISO', {duration : 2000});
  }

  logingButtonDisable() {
    console.log(this.loaderService.isLoading.value)
    if(this.formLogin.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }

}
