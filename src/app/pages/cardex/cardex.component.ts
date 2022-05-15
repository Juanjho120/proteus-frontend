import { NgxSpinnerService } from 'ngx-spinner';
import { CuadrarPasswordDialogoComponent } from './cuadrar-password-dialogo/cuadrar-password-dialogo.component';
import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { ReporteService } from './../../_service/reporte.service';
import { CardexDialogoEliminarComponent } from './cardex-dialogo-eliminar/cardex-dialogo-eliminar.component';
import { CardexDialogoComponent } from './cardex-dialogo/cardex-dialogo.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RepuestoService } from './../../_service/repuesto.service';
import { MatSort } from '@angular/material/sort';
import { Repuesto } from './../../_model/repuesto';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { LoaderService } from 'src/app/_service/loader.service';
import { Observable } from 'rxjs';
import { Sucursal } from 'src/app/_model/sucursal';
import { SucursalService } from 'src/app/_service/sucursal.service';

@Component({
  selector: 'app-cardex',
  templateUrl: './cardex.component.html',
  styleUrls: ['./cardex.component.css']
})
export class CardexComponent implements OnInit {

  displayedColumns = ['codigo', 'descripcion', 'existencia', 'precio', 'acciones'];
  dataSource : MatTableDataSource<Repuesto>;
  @ViewChild(MatSort) sort : MatSort;
  @ViewChild(MatPaginator) paginator : MatPaginator;

  idVentana : number = VentanaUtil.CARDEX;

  sucursales$ : Observable<Sucursal[]>;
  idSucursal : number = 1;

  linkNuevo : string = `/cardex/nuevo/${this.idSucursal}`

  cardex : Repuesto[] = [];

  constructor(
    private repuestoService : RepuestoService,
    private reporteService : ReporteService,
    private sucursalService : SucursalService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    private spinner: NgxSpinnerService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.sucursales$ = this.sucursalService.getAll();

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.REPUESTOS, PermisoUtil.CONSULTAR)) {
      this.repuestoService.getObjetoCambio().subscribe(data => {
        this.cardex = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  
      this.repuestoService.getMensajeCambio().subscribe(data => {
        this.snackBar.open(data, 'AVISO', {duration : 2000});
      });
  
      this.repuestoService.getAll().subscribe(data => {
        this.cardex = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  filter(value : string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  abrirDialogoEdicion(repuesto? : Repuesto) {
    let repuestoAux = repuesto != null ? repuesto : new Repuesto();
    this.dialog.open(CardexDialogoComponent, {
      width : '400px',
      data : { repuesto: repuestoAux, idSucursal: this.idSucursal }
    });
  }

  abrirDialogoEliminar(repuesto : Repuesto) {
    this.dialog.open(CardexDialogoEliminarComponent, {
      width: '300px',
      data: repuesto
    });
  }

  crearCardexIndividual(repuesto : Repuesto) {
    this.spinner.show()
    this.reporteService.crearReporteCardexIndividualServicioFactura(repuesto.idRepuesto, this.idSucursal).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Cardex_${repuesto.codigo}.pdf`;
      a.click();
      this.spinner.hide()
    });
  }

  imprimirCardex() {
    this.spinner.show()
    this.reporteService.crearReporteCardex(this.idSucursal).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = `CardexCorporacionDiaz.pdf`;
      a.click();
      this.spinner.hide()
    });
  }

  cuadrarInventariosRepuestos() {
    this.dialog.open(CuadrarPasswordDialogoComponent, {
      width: '300px'
    });
  }

  filtrarPorSucursal() {
    this.linkNuevo = `/cardex/nuevo/${this.idSucursal}`;
    this.cardex = this.cardex.map((repuesto) => ({
      ...repuesto,
      existencia: this.idSucursal == 1 ? repuesto.existenciaCcdd 
        : this.idSucursal == 2 ? repuesto.existenciaIidd 
          : (repuesto.existenciaCcdd + repuesto.existenciaIidd)
    }));
    this.dataSource = new MatTableDataSource(this.cardex);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
