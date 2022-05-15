import { Ventana } from './_model/ventana';
import { LoginService } from './_service/login.service';
import { Component, OnInit } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ventanas : Ventana[] = []
  title = 'proteus-frontend';
  opened = false;
  username : string = "";

  constructor(
    public loginService : LoginService
  ) {}

  ngOnInit() {
    this.username = sessionStorage.getItem(environment.COMPLETE_NAME);
    
    this.loginService.getVentanaCambio().subscribe(data => {
      if(data.length>0) {
        this.opened = true;
      } else {
        this.opened = false;
      }
      this.ventanas = [];
      for(let ventana of data) {
        if(ventana.url!="/perfil") {
          this.ventanas.push(ventana);
        }
      }
      //this.ventanas = data;
    });

  }

}
