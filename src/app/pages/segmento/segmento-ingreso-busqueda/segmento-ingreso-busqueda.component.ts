import { PermisoUtil } from './../../../shared/permisoUtil';
import { TablaUtil } from './../../../shared/tablaUtil';
import { LoginService } from './../../../_service/login.service';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { SegmentoIngresoBusquedaDialogoComponent } from './../segmento-ingreso-busqueda/segmento-ingreso-busqueda-dialogo/segmento-ingreso-busqueda-dialogo.component';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SegmentoService } from './../../../_service/segmento.service';
import { MatTableDataSource } from '@angular/material/table';
import { Segmento } from './../../../_model/segmento';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SegmentoIngresoBusquedaDialogoEliminarComponent } from './segmento-ingreso-busqueda-dialogo-eliminar/segmento-ingreso-busqueda-dialogo-eliminar.component';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-segmento-ingreso-busqueda',
  templateUrl: './segmento-ingreso-busqueda.component.html',
  styleUrls: ['./segmento-ingreso-busqueda.component.css']
})
export class SegmentoIngresoBusquedaComponent implements OnInit {

  displayedColumns = ['codigo', 'nombre', 'nit', 'direccion', 'acciones'];
  dataSource : MatTableDataSource<Segmento>;
  @ViewChild(MatSort) sort : MatSort;

  idVentana : number = VentanaUtil.SEGMENTOS;

  constructor(
    private segmentoService : SegmentoService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.CONSULTAR)) {
      this.segmentoService.getObjetoCambio().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });

      this.segmentoService.getAll().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      });
    }
    
    this.segmentoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });
    
  }

  filter(value : string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  abrirDialogoEdicion(segmento? : Segmento) {
    let segmentoAux = segmento != null ? segmento : new Segmento();
    this.dialog.open(SegmentoIngresoBusquedaDialogoComponent, {
      width : '400px',
      data : segmentoAux
    })
  }

  abrirDialogoEliminar(segmento : Segmento) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.SEGMENTOS, PermisoUtil.ELIMINAR)) {
      this.dialog.open(SegmentoIngresoBusquedaDialogoEliminarComponent, {
        width : '400px',
        data : segmento
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

}
