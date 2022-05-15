import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteService } from './../../_service/reporte.service';
import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { MatDialog } from '@angular/material/dialog';
import { PlacaDialogoEliminarComponent } from './placa-dialogo-eliminar/placa-dialogo-eliminar.component';
import { switchMap } from 'rxjs/operators';
import { MarcaAuto } from 'src/app/_model/marcaAuto';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MarcaAutoService } from './../../_service/marca-auto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlacaService } from './../../_service/placa.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Placa } from './../../_model/placa';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LoaderService } from 'src/app/_service/loader.service';
import { PlacaSegmentoDTO } from 'src/app/_model/dto/placaSegmentoDTO';

@Component({
  selector: 'app-placa',
  templateUrl: './placa.component.html',
  styleUrls: ['./placa.component.css']
})
export class PlacaComponent implements OnInit {

  displayedColumns = ['numero', 'marcaAuto', 'fechaUltimoServicio', 'ultimoKilometraje', 'cantServicios', 'segmentos', 'acciones'];
  dataSource : MatTableDataSource<PlacaSegmentoDTO>;
  @ViewChild(MatSort) sort : MatSort;
  @ViewChild(MatPaginator) paginator : MatPaginator;

  form : FormGroup;
  marcaAutos$ : Observable<MarcaAuto[]>;
  idMarcaAuto : number;

  maxFecha: Date = new Date();
  fechaUltimoServicioSeleccionado: Date = new Date();
  fechaUltimoServicioFormato : string;
  formatoFecha : string = 'YYYY-MM-DD';

  formPlacaDisable = true;

  idVentana : number = VentanaUtil.PLACAS;

  constructor(
    private placaService : PlacaService,
    private marcaAutoService : MarcaAutoService,
    private reporteService : ReporteService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.CONSULTAR)) {
      /*this.placaService.getObjetoCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });*/

      this.placaService.getAllWithSegmentos().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.MARCAS_AUTO, PermisoUtil.CONSULTAR)) {
      this.marcaAutos$ = this.marcaAutoService.getAll();
    }

    this.placaService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.initForm();

    this.disableForm();
    
  }

  initForm() {
    this.fechaUltimoServicioFormato = "";
    this.idMarcaAuto = 0;
    this.form = new FormGroup({
      'id' : new FormControl(''),
      'marcaAuto' : new FormControl('', Validators.required),
      'numero' : new FormControl('', Validators.required),
      'fechaUltimoServicio' : new FormControl('', Validators.required),
      'ultimoKilometraje' : new FormControl('0', Validators.required)
    });
  }

  filter(value : string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  cambiarFechaUltimoServicio(e : any) {
    this.fechaUltimoServicioSeleccionado = e.value;
    this.fechaUltimoServicioFormato = moment(this.fechaUltimoServicioSeleccionado).format(this.formatoFecha);
  }

  f() {
    return this.form.controls;
  }

  formularioEdicion(placa : Placa) {
    this.enableForm();
    this.form = new FormGroup({
      'id' : new FormControl(placa.idPlaca),
      'marcaAuto' : new FormControl(placa.marcaAuto.idMarcaAuto, Validators.required),
      'numero' : new FormControl(placa.numero, Validators.required),
      'fechaUltimoServicio' : new FormControl(placa.fechaUltimoServicio, Validators.required),
      'ultimoKilometraje' : new FormControl(placa.ultimoKilometraje, Validators.required)
    });

    this.idMarcaAuto = placa.marcaAuto.idMarcaAuto;
    this.fechaUltimoServicioFormato = placa.fechaUltimoServicio;
  }

  disableForm() {
    this.initForm();
    document.getElementById("mat-card-formulario").style.visibility = "hidden";
  }

  enableForm() {
    document.getElementById("mat-card-formulario").style.visibility = "visible";
  }

  operar() {
    let placa : Placa = new Placa();
    placa.idPlaca = this.form.value['id'];
    placa.marcaAuto = new MarcaAuto();
    placa.marcaAuto.idMarcaAuto = this.form.value['marcaAuto'];
    placa.numero = this.form.value['numero'].toUpperCase();
    placa.ultimoKilometraje = this.form.value['ultimoKilometraje'];
    placa.fechaUltimoServicio = this.fechaUltimoServicioFormato;

    if(placa.idPlaca != null && placa.idPlaca > 0) {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.EDITAR)) {
        this.placaService.updateMod(placa, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.placaService.getAllWithSegmentos();
        })).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.placaService.setObjetoCambio(data.map((placaSegmento) => placaSegmento.placa));
          this.placaService.setMensajeCambio('Placa actualizada');
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    } else {
      if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.CREAR)) {
        this.placaService.createMod(placa, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
          return this.placaService.getAllWithSegmentos();
        })).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.placaService.setObjetoCambio(data.map((placaSegmento) => placaSegmento.placa));
          this.placaService.setMensajeCambio('Placa registrada');
        });
      } else {
        this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
      }
    }

    this.initForm();

    this.disableForm();
  }

  abrirDialogoEliminar(placa : Placa) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PLACAS, PermisoUtil.ELIMINAR)) {
      this.dialog.open(PlacaDialogoEliminarComponent, {
        width: '300px',
        data: placa
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }

  crearReporteServiciosPorPlaca(placa : Placa) {
    this.spinner.show()
    this.reporteService.crearReporteServiciosPorPlaca(placa.idPlaca).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Servicios_Placa${placa.numero}.pdf`;
      a.click();
      this.spinner.hide()
    });
  }

  evaluarBotonGuardarPlaca() {
    if(this.form.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }
}
