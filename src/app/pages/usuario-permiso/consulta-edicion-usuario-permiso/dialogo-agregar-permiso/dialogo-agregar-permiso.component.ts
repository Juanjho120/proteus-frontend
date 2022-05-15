import { VentanaRol } from './../../../../_model/ventanaRol';
import { Permiso } from './../../../../_model/permiso';
import { TablaPermisoDTO } from './../../../../_model/dto/tablaPermisoDTO';
import { MatTableDataSource } from '@angular/material/table';
import { VentanaTablaDTO } from './../../../../_model/dto/ventanaTablaDTO';
import { RolVentanaDTO } from './../../../../_model/dto/rolVentanaDTO';
import { VentanaRolService } from './../../../../_service/ventana-rol.service';
import { UsuarioRolDTO } from './../../../../_model/dto/usuarioRolDTO';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { Ventana } from 'src/app/_model/ventana';
import { Tabla } from 'src/app/_model/tabla';

@Component({
  selector: 'app-dialogo-agregar-permiso',
  templateUrl: './dialogo-agregar-permiso.component.html',
  styleUrls: ['./dialogo-agregar-permiso.component.css']
})
export class DialogoAgregarPermisoComponent implements OnInit {

  usuarioDto : UsuarioRolDTO;

  rolesVentanasDefault : RolVentanaDTO[] = [];
  rolesVentanasIn : RolVentanaDTO[] = [];
  rolesVentanasNotIn : RolVentanaDTO[] = [];

  ventanasDefault : VentanaTablaDTO[] = [];
  dataSourceVentanasDefault : MatTableDataSource<VentanaTablaDTO>;

  tablasDefault : TablaPermisoDTO[] = [];
  dataSourceTablasDefault : MatTableDataSource<TablaPermisoDTO>;

  permisosDefault : Permiso[] = [];
  dataSourcePermisosDefault : MatTableDataSource<Permiso>;

  idVentanaDefaultSeleccionado : number = -1;
  idTablaDefaultSeleccionado : number = -1;
  idPermisoDefaultSeleccionado : number = -1;

  displayedColumnsNombre = ['nombreP'];

  constructor(
    private dialogRef : MatDialogRef<DialogoAgregarPermisoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : UsuarioRolDTO,
    private ventanaRolSevice : VentanaRolService
  ) { }

  ngOnInit(): void {
    this.usuarioDto = this.data;
    this.ventanaRolSevice.getDefault().subscribe(data => {
      if(data!=null && data.length>0) {
        this.rolesVentanasDefault = data;
        this.ventanaRolSevice.getByUsername(this.usuarioDto.username).subscribe(dataU => {
          if(dataU!=null && dataU.length>0) {
            this.rolesVentanasIn = dataU;
            let rolVentanaNotIn = new RolVentanaDTO();
            let ventanasNotIn : VentanaTablaDTO[] = [];
            for(let ventanaDefault of this.rolesVentanasDefault[0].ventanas) {
                let existeVentana = false;
                for(let ventanaUsuario of this.rolesVentanasIn[0].ventanas) {
                  if(ventanaUsuario.idVentana==ventanaDefault.idVentana) {
                    let ventanaNotIn = new VentanaTablaDTO();
                    ventanaNotIn.idVentana = ventanaDefault.idVentana;
                    ventanaNotIn.ventana = ventanaDefault.ventana;
                    ventanaNotIn.tablas = [];
                    existeVentana = true;
                    for(let tablaDefault of ventanaDefault.tablas) {
                      let existeTabla = false;
                      for(let tablaUsuario of ventanaUsuario.tablas) {
                        if(tablaDefault.idTabla==tablaUsuario.idTabla) {
                          let tablaNotIn = new TablaPermisoDTO();
                          tablaNotIn.idTabla = tablaDefault.idTabla;
                          tablaNotIn.tabla = tablaDefault.tabla;
                          tablaNotIn.permisos = [];
                          existeTabla = true;
                          for(let permisoDefault of tablaDefault.permisos) {
                            let existePermiso = false;
                            for(let permisoUsuario of tablaUsuario.permisos) {
                              if(permisoDefault.idPermiso==permisoUsuario.idPermiso) {
                                existePermiso = true;
                              }
                            }
                            if(!existePermiso) {
                              tablaNotIn.permisos.push(permisoDefault);
                            }
                          }
                          if(tablaNotIn.permisos.length>0) {
                            ventanaNotIn.tablas.push(tablaNotIn);
                          }
                        }
                      }
                      if(!existeTabla) {
                        ventanaNotIn.tablas.push(tablaDefault);
                      }
                    }
                    if(ventanaNotIn.tablas.length>0) {
                      ventanasNotIn.push(ventanaNotIn);
                    }
                  }
                }
                if(!existeVentana) {
                  ventanasNotIn.push(ventanaDefault);
                }
            }
            rolVentanaNotIn.ventanas = ventanasNotIn;
            if(rolVentanaNotIn.ventanas.length>0) {
              this.rolesVentanasNotIn.push(rolVentanaNotIn);
              this.dataSourceVentanasDefault = new MatTableDataSource(rolVentanaNotIn.ventanas);
            }
          }
        });
      }
    });
  }

  seleccionarVentana(ventanaTablaDTO : VentanaTablaDTO) {
    this.idVentanaDefaultSeleccionado = ventanaTablaDTO.idVentana;
    this.dataSourceTablasDefault = new MatTableDataSource();
    this.dataSourcePermisosDefault = new MatTableDataSource();
    this.idTablaDefaultSeleccionado = -1;
    this.idPermisoDefaultSeleccionado = -1;
    this.tablasDefault = ventanaTablaDTO.tablas;
    this.dataSourceTablasDefault = new MatTableDataSource(this.tablasDefault);
  }

  seleccionarTabla(tablaPermisoDTO : TablaPermisoDTO) {
    this.idTablaDefaultSeleccionado = tablaPermisoDTO.idTabla;
    this.dataSourcePermisosDefault = new MatTableDataSource();
    this.idPermisoDefaultSeleccionado = -1;
    this.permisosDefault = tablaPermisoDTO.permisos;
    this.dataSourcePermisosDefault = new MatTableDataSource(this.permisosDefault);
  }

  seleccionarPermiso(permiso : Permiso) {
    this.idPermisoDefaultSeleccionado = permiso.idPermiso;
  }

  evaluarConcederPermisoBoton() {
    if(this.idVentanaDefaultSeleccionado>0 && this.idTablaDefaultSeleccionado>0 && this.idPermisoDefaultSeleccionado>0) {
      return false;
    }
    return true;
  }

  concederPermiso() {
    let ventanaRol = new VentanaRol();
    ventanaRol.rol = this.usuarioDto.rol;
    ventanaRol.ventana = new Ventana();
    ventanaRol.ventana.idVentana = this.idVentanaDefaultSeleccionado;
    ventanaRol.tabla = new Tabla();
    ventanaRol.tabla.idTabla = this.idTablaDefaultSeleccionado;
    ventanaRol.permiso = new Permiso();
    ventanaRol.permiso.idPermiso = this.idPermisoDefaultSeleccionado;
    this.ventanaRolSevice.create(ventanaRol).subscribe(() => {
      this.dialogRef.close(1);
    });
  }


}
