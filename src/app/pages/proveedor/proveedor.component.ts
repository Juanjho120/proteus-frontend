import { PermisoUtil } from './../../shared/permisoUtil';
import { TablaUtil } from './../../shared/tablaUtil';
import { LoginService } from './../../_service/login.service';
import { VentanaUtil } from './../../shared/ventanaUtil';
import { switchMap } from 'rxjs/operators';
import { ProveedorMenorDialogoEliminarComponent } from './proveedor-menor-dialogo-eliminar/proveedor-menor-dialogo-eliminar.component';
import { ProveedorMenorDialogoComponent } from './proveedor-menor-dialogo/proveedor-menor-dialogo.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProveedorMenorService } from './../../_service/proveedor-menor.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProveedorMenor } from './../../_model/proveedorMenor';
import { ProveedorAsesorService } from './../../_service/proveedor-asesor.service';
import { AsesorDialogoComponent } from './asesor-dialogo/asesor-dialogo.component';
import { AsesorDialogoEliminarComponent } from './asesor-dialogo-eliminar/asesor-dialogo-eliminar.component';
import { ProveedorDialogoEliminarComponent } from './proveedor-dialogo-eliminar/proveedor-dialogo-eliminar.component';
import { ProveedorDialogoComponent } from './proveedor-dialogo/proveedor-dialogo.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorAsesor } from './../../_model/proveedorAsesor';
import { Proveedor } from './../../_model/proveedor';
import { ProveedorDTO } from './../../_model/dto/proveedorDTO';
import { ProveedorService } from './../../_service/proveedor.service';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/_service/loader.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  proveedores : ProveedorDTO[] = [];

  displayedColumnsProveedorMenor = ['nombre', 'acciones'];
  dataSourceProveedorMenor : MatTableDataSource<ProveedorMenor>;

  formProveedorMenor: FormGroup;

  idVentana : number = VentanaUtil.PROVEEDORES;

  constructor(
    private proveedorService : ProveedorService,
    private proveedorAsesorService : ProveedorAsesorService,
    private proveedorMenorService : ProveedorMenorService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar,
    private loginService : LoginService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES, PermisoUtil.CONSULTAR)) {
      this.proveedorService.getObjetoCambio().subscribe(data => {
        this.proveedorService.getAllDTO().subscribe(datas => {
          this.proveedores = datas;
        });
      });

      this.proveedorService.getAllDTO().subscribe(data => {
        this.proveedores = data;
      });
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDOR_ASESORES, PermisoUtil.CONSULTAR)) {
      this.proveedorAsesorService.getObjetoCambio().subscribe(data => {
        this.proveedorService.getAllDTO().subscribe(datas => {
          this.proveedores = datas;
        });
      });
    }

    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES_MENORES, PermisoUtil.CONSULTAR)) {
      this.proveedorMenorService.getObjetoCambio().subscribe(data => {
        this.dataSourceProveedorMenor = new MatTableDataSource(data);
      });

      this.proveedorMenorService.getAll().subscribe(data => {
        this.dataSourceProveedorMenor = new MatTableDataSource(data);
      });
    }

    this.proveedorAsesorService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.proveedorService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.proveedorMenorService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration : 2000});
    });

    this.formProveedorMenor = new FormGroup({
      'nombre' : new FormControl('', Validators.required)
    });
  }

  abrirAsesorDialogo(proveedorAsesor : ProveedorAsesor, proveedorDTO : ProveedorDTO) {
    let proveedorAsesorAux = new ProveedorAsesor();
    if(proveedorAsesor != null) {
      proveedorAsesorAux = proveedorAsesor;
    } else if(proveedorDTO != null) {
      proveedorAsesorAux.proveedor = proveedorDTO.proveedor;
    }
    this.dialog.open(AsesorDialogoComponent, {
      width: '300px',
      data: proveedorAsesorAux
    })
  }

  abrirAsesorDialogoEliminar(proveedorAsesor : ProveedorAsesor) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDOR_ASESORES, PermisoUtil.ELIMINAR)) {
      this.dialog.open(AsesorDialogoEliminarComponent, {
        width: '300px',
        data: proveedorAsesor
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirProveedorDialogo(proveedor : Proveedor) {
    let proveedorAux = proveedor != null ? proveedor : new Proveedor();
    this.dialog.open(ProveedorDialogoComponent, {
      width: '350px',
      data: proveedorAux
    })
  }

  abrirProveedorDialogoEliminar(proveedor : Proveedor) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES, PermisoUtil.ELIMINAR)) {
      this.dialog.open(ProveedorDialogoEliminarComponent, {
        width: '300px',
        data: proveedor
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirDialogoEdicionProveedorMenor(proveedorMenor : ProveedorMenor) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES_MENORES, PermisoUtil.EDITAR)) {
      this.dialog.open(ProveedorMenorDialogoComponent, {
        width: '400px',
        data : proveedorMenor
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  abrirDialogoEliminarProveedorMenor(proveedorMenor : ProveedorMenor) {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES_MENORES, PermisoUtil.ELIMINAR)) {
      this.dialog.open(ProveedorMenorDialogoEliminarComponent, {
        width: '300px',
        data : proveedorMenor
      });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
    
  }

  crearProveedorMenor() {
    if(this.loginService.tienePermiso(this.idVentana, TablaUtil.PROVEEDORES_MENORES, PermisoUtil.CREAR)) {
      let proveedorMenor = new ProveedorMenor();
      proveedorMenor.nombre = this.formProveedorMenor.value['nombre'].toUpperCase();
      this.proveedorMenorService.createMod(proveedorMenor, parseInt(sessionStorage.getItem('idUsuario'))).pipe(switchMap(() => {
      return this.proveedorMenorService.getAll();
    })).subscribe(data => {
      this.proveedorMenorService.setObjetoCambio(data);
      this.proveedorMenorService.setMensajeCambio('Proveedor menor creado');
      this.formProveedorMenor.reset();
    });
    } else {
      this.snackBar.open('No tiene permiso para utilizar esta funcion', 'AVISO', {duration : 2000});
    }
  }
  
  evaluarBotonGuardarProveedorMenor() {
    if(this.formProveedorMenor.invalid || this.loaderService.isLoading.value) {
      return true;
    }
    return false;
  }

}
