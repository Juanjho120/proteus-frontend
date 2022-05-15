import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { RepuestoService } from './../../../_service/repuesto.service';
import { Repuesto } from './../../../_model/repuesto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/_service/loader.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-cardex-nuevo',
  templateUrl: './cardex-nuevo.component.html',
  styleUrls: ['./cardex-nuevo.component.css']
})
export class CardexNuevoComponent implements OnInit {

  idVentana : number = VentanaUtil.CARDEX;
  form : FormGroup;

  idSucursal : number = 1;

  constructor(
    private repuestoService : RepuestoService,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.route.params.subscribe((params : Params) => {
      this.idSucursal = params['idSucursal'];
    })
    this.form = new FormGroup({
      'id': new FormControl(0),
      'codigo': new FormControl('', Validators.required),
      'codigoBarra' : new FormControl(''),
      'descripcion' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'existencia' : new FormControl('', Validators.required),
      'precio' : new FormControl('0', Validators.required)
    });

    this.form.get('precio').disable();
    if(sessionStorage.getItem('idUsuario')!=null && sessionStorage.getItem('idUsuario')=='2') {
      this.form.get('precio').enable();
    }
  }

  f() {
    return this.form.controls;
  }

  operar() {
    if(this.form.invalid) {return; }

    let repuesto = new Repuesto();
    repuesto.idRepuesto = this.form.value['id'];
    repuesto.codigo = this.form.value['codigo'].toUpperCase();
    repuesto.codigoBarra = this.form.value['codigoBarra'];
    repuesto.descripcion = this.form.value['descripcion'].toUpperCase();
    repuesto.existencia = this.form.value['existencia'];
    repuesto.existenciaCcdd = this.idSucursal == 1 ? repuesto.existencia : 0;
    repuesto.existenciaIidd = this.idSucursal == 2 ? repuesto.existencia : 0;
    repuesto.precio = 0;
    if(sessionStorage.getItem('idUsuario')!=null && sessionStorage.getItem('idUsuario')=='2') {
      repuesto.precio = this.form.value['precio'];
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.CREAR)) {
      this.spinner.show()
      this.repuestoService.createMod(repuesto, parseInt(sessionStorage.getItem('idUsuario'))).subscribe((dataR:Repuesto) => {
        this.repuestoService.getAll().subscribe(data => {
          this.repuestoService.setObjetoCambio(data);
          this.repuestoService.setMensajeCambio('Repuesto creado');
          this.spinner.hide()
        });
      }, (error:any) => this.spinner.hide());
  
      this.initForm();
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }

  evaluarBotonGuardarRepuesto() {
    if(this.form.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }
}
