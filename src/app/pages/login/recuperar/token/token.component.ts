import { PasswordValidation } from './match';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoginService } from './../../../../_service/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  form: FormGroup;
  token: string;
  mensaje: string;
  error: string;
  rpta: number;
  tokenValido: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService : LoginService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: [''],
      confirmPassword: ['']
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.route.params.subscribe((params : Params) => {
      this.token = params['token'];
      this.loginService.verificarTokenReset(this.token).subscribe(data => {
        //this.tokenValido = true;
        if(data === 1){
          this.tokenValido = true;
        }else{
          this.tokenValido = false;
          setTimeout( () => {
            this.router.navigate(['login']);
          }, 2000)
        }
      });
    })

  }

  onSubmit(){
    let clave: string = this.form.value.confirmPassword;
    this.loginService.restablecer(this.token, clave).subscribe(data => {
      this.mensaje = 'Se cambio la contraseña';

        setTimeout(() => {          
          this.router.navigate(['login']);
        }, 2000);
    });
  }

}
