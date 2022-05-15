import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CuentaBancariaService } from './../../../../_service/cuenta-bancaria.service';
import { BancoService } from './../../../../_service/banco.service';
import { CuentaBancariaTipoService } from './../../../../_service/cuenta-bancaria-tipo.service';
import { MonedaService } from './../../../../_service/moneda.service';
import { CuentaBancariaTipo } from './../../../../_model/cuentaBancariaTipo';
import { Moneda } from './../../../../_model/moneda';
import { Banco } from './../../../../_model/banco';
import { Categoria } from './../../../../_model/categoria';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CuentaBancaria } from './../../../../_model/cuentaBancaria';

@Component({
  selector: 'app-cuenta-bancaria-dialogo-editar',
  templateUrl: './cuenta-bancaria-dialogo-editar.component.html',
  styleUrls: ['./cuenta-bancaria-dialogo-editar.component.css']
})
export class CuentaBancariaDialogoEditarComponent implements OnInit {

  formCuentaBancaria : FormGroup;

  bancos$ : Observable<Banco[]>;
  idBanco : number = 0;

  monedas$ : Observable<Moneda[]>;
  idMoneda : number = 0;

  cuentaBancariaTipos$ : Observable<CuentaBancariaTipo[]>;
  idCuentaBancariaTipo : number = 0;

  cuentaBancaria : CuentaBancaria;

  constructor(
    private dialogRef : MatDialogRef<CuentaBancariaDialogoEditarComponent>,
    @Inject(MAT_DIALOG_DATA) private data : CuentaBancaria,
    private cuentaBancariaService : CuentaBancariaService,
    private bancoService : BancoService,
    private cuentaBancariaTipoService : CuentaBancariaTipoService,
    private monedaService : MonedaService,
  ) { }

  ngOnInit(): void {
    this.bancos$ = this.bancoService.getAll();
    this.cuentaBancariaTipos$ = this.cuentaBancariaTipoService.getAll();
    this.monedas$ = this.monedaService.getAll();

    this.cuentaBancaria = new CuentaBancaria();
    this.cuentaBancaria.idCuentaBancaria = this.data.idCuentaBancaria;
    this.cuentaBancaria.nombre = this.data.nombre;
    this.cuentaBancaria.numero = this.data.numero;
    this.cuentaBancaria.idItem = this.data.idItem;
    this.cuentaBancaria.categoria = new Categoria();
    this.cuentaBancaria.banco = new Banco();
    this.cuentaBancaria.moneda = new Moneda();
    this.cuentaBancaria.cuentaBancariaTipo = new CuentaBancariaTipo();
    
    this.cuentaBancaria.categoria.idCategoria = this.data.categoria.idCategoria;
    this.cuentaBancaria.banco.idBanco = this.data.banco.idBanco;
    this.cuentaBancaria.cuentaBancariaTipo.idCuentaBancariaTipo = this.data.cuentaBancariaTipo.idCuentaBancariaTipo;
    this.cuentaBancaria.moneda.idMoneda = this.data.moneda.idMoneda;

    this.idBanco = this.data.banco.idBanco;
    this.idCuentaBancariaTipo = this.data.cuentaBancariaTipo.idCuentaBancariaTipo;
    this.idMoneda = this.data.moneda.idMoneda;

    this.initFormCuentaBancaria();
  }

  initFormCuentaBancaria() {
    this.formCuentaBancaria = new FormGroup({
      'numero' : new FormControl(this.cuentaBancaria.numero, Validators.required),
      'nombre' : new FormControl(this.cuentaBancaria.nombre, Validators.required),
      'banco' : new FormControl(this.idBanco, Validators.required),
      'cuentaBancariaTipo' : new FormControl(this.idCuentaBancariaTipo, Validators.required),
      'moneda' : new FormControl(this.idMoneda, Validators.required)
    });
  }

  operar() {
    this.cuentaBancaria.nombre = this.formCuentaBancaria.value['nombre'];
    this.cuentaBancaria.numero = this.formCuentaBancaria.value['numero'];
    this.cuentaBancaria.banco = new Banco();
    this.cuentaBancaria.banco.idBanco = this.idBanco;
    this.cuentaBancaria.cuentaBancariaTipo = new CuentaBancariaTipo();
    this.cuentaBancaria.cuentaBancariaTipo.idCuentaBancariaTipo = this.idCuentaBancariaTipo;
    this.cuentaBancaria.moneda = new Moneda();
    this.cuentaBancaria.moneda.idMoneda = this.idMoneda;

    this.cuentaBancariaService.update(this.cuentaBancaria).pipe(switchMap(() => {
      return this.cuentaBancariaService.getAll();
    })).subscribe(data => {
      this.cuentaBancariaService.setObjetoCambio(data);
      this.cuentaBancariaService.setMensajeCambio('Cuenta bancaria actualizada');
      this.cerrar();
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
