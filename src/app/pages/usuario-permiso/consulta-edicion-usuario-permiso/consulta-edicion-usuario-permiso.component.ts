import { DialogoEditarUsuarioComponent } from './dialogo-editar-usuario/dialogo-editar-usuario.component';
import { VentanaRol } from './../../../_model/ventanaRol';
import { DialogoEliminarTablaComponent } from './dialogo-eliminar-tabla/dialogo-eliminar-tabla.component';
import { DialogoEliminarUsuarioComponent } from './dialogo-eliminar-usuario/dialogo-eliminar-usuario.component';
import { DialogoEliminarVentanaComponent } from './dialogo-eliminar-ventana/dialogo-eliminar-ventana.component';
import { DialogoEliminarPermisoComponent } from './dialogo-eliminar-permiso/dialogo-eliminar-permiso.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogoAgregarPermisoComponent } from './dialogo-agregar-permiso/dialogo-agregar-permiso.component';
import { MatDialog } from '@angular/material/dialog';
import { TablaPermisoDTO } from './../../../_model/dto/tablaPermisoDTO';
import { VentanaTablaDTO } from './../../../_model/dto/ventanaTablaDTO';
import { RolVentanaDTO } from './../../../_model/dto/rolVentanaDTO';
import { VentanaRolService } from './../../../_service/ventana-rol.service';
import { Permiso } from './../../../_model/permiso';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from './../../../_service/usuario.service';
import { UsuarioRolDTO } from './../../../_model/dto/usuarioRolDTO';
import { VentanaUtil } from './../../../shared/ventanaUtil';
import { Component, OnInit } from '@angular/core';
import { Ventana } from 'src/app/_model/ventana';
import { Tabla } from 'src/app/_model/tabla';

@Component({
  selector: 'app-consulta-edicion-usuario-permiso',
  templateUrl: './consulta-edicion-usuario-permiso.component.html',
  styleUrls: ['./consulta-edicion-usuario-permiso.component.css']
})
export class ConsultaEdicionUsuarioPermisoComponent implements OnInit {

  usuariosDTO : UsuarioRolDTO[] = [];
  displayedColumnsUsuarios = ['nombre', 'username', 'email', 'telefono', 'rol', 'estado', 'acciones'];
  dataSourceUsuarios : MatTableDataSource<UsuarioRolDTO>;

  rolesVentanasIn : RolVentanaDTO[] = [];

  displayedColumnsNombre = ['nombreP', 'accionesP'];

  ventanasIn : VentanaTablaDTO[] = [];
  dataSourceVentanasIn : MatTableDataSource<VentanaTablaDTO>;

  tablasIn : TablaPermisoDTO[] = [];
  dataSourceTablasIn : MatTableDataSource<TablaPermisoDTO>;

  permisosIn : Permiso[] = [];
  dataSourcePermisosIn : MatTableDataSource<Permiso>;

  idVentanaInSeleccionado : number = -1;
  idTablaInSeleccionado : number = -1;
  idPermisoInSeleccionado : number = -1;
  idUsuarioSeleccionado : number = -1;

  ventanaRolSeleccionado : VentanaRol = new VentanaRol();

  idVentana : number = VentanaUtil.USUARIOS_Y_PERMISOS;

  constructor(
    private usuarioService : UsuarioService,
    private ventanaRolSevice : VentanaRolService,
    private dialog : MatDialog,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarPermisosUsuario();
  }

  seleccionarUsuario(usuario : UsuarioRolDTO) {
    this.ventanasIn = [];
    this.dataSourceVentanasIn = new MatTableDataSource();
    this.dataSourceTablasIn = new MatTableDataSource();
    this.dataSourcePermisosIn = new MatTableDataSource();
    this.idUsuarioSeleccionado = usuario.idUsuario;
    this.idVentanaInSeleccionado = -1;
    this.idTablaInSeleccionado = -1;
    this.idPermisoInSeleccionado = -1;
    this.ventanaRolSevice.getByUsername(usuario.username).subscribe(data => {
      if(data!=null && data.length>0) {
        this.rolesVentanasIn = data;
        this.ventanasIn = this.rolesVentanasIn[0].ventanas;
        this.dataSourceVentanasIn = new MatTableDataSource(this.ventanasIn);
      }
    });

    this.ventanaRolSeleccionado.rol = usuario.rol;
  }
  
  seleccionarVentana(ventanaTablaDTO : VentanaTablaDTO) {
    this.idVentanaInSeleccionado = ventanaTablaDTO.idVentana;
    this.dataSourceTablasIn = new MatTableDataSource();
    this.dataSourcePermisosIn = new MatTableDataSource();
    this.idTablaInSeleccionado = -1;
    this.idPermisoInSeleccionado = -1;
    this.tablasIn = ventanaTablaDTO.tablas;
    this.dataSourceTablasIn = new MatTableDataSource(this.tablasIn);

    this.ventanaRolSeleccionado.ventana = new Ventana();
    this.ventanaRolSeleccionado.ventana.idVentana = ventanaTablaDTO.idVentana;
    this.ventanaRolSeleccionado.ventana.nombre = ventanaTablaDTO.ventana;
  }

  seleccionarTabla(tablaPermisoDTO : TablaPermisoDTO) {
    this.idTablaInSeleccionado = tablaPermisoDTO.idTabla;
    this.dataSourcePermisosIn = new MatTableDataSource();
    this.idPermisoInSeleccionado = -1;
    this.permisosIn = tablaPermisoDTO.permisos;
    this.dataSourcePermisosIn = new MatTableDataSource(this.permisosIn);

    this.ventanaRolSeleccionado.tabla = new Tabla();
    this.ventanaRolSeleccionado.tabla.idTabla = tablaPermisoDTO.idTabla;
    this.ventanaRolSeleccionado.tabla.nombre = tablaPermisoDTO.tabla;
  }

  abrirDialogoEdicionUsuario(idUsuario : number) {
    for(let usuarioDto of this.usuariosDTO) {
      if(usuarioDto.idUsuario == idUsuario) {
        if(usuarioDto.rol.nombre=="ADMINISTRADOR") {
          this.snackBar.open("No es posible modificar los datos de un administrador", 'AVISO', {duration : 2000});
        } else {
          let dialogRef = this.dialog.open(DialogoEditarUsuarioComponent, {
            width : '350px',
            data : usuarioDto
          });
  
          dialogRef.afterClosed().subscribe(data => {
            if(data!=null && data>0) {
              this.cargarPermisosUsuario();
              this.snackBar.open("Usuario actualizado", 'AVISO', {duration : 2000});
            }
          });
        }
      }
    }
  }

  abrirDialogoEliminarUsuario(idUsuario : number) {
    for(let usuarioDto of this.usuariosDTO) {
      if(usuarioDto.idUsuario == idUsuario) {
        if(usuarioDto.rol.nombre=="ADMINISTRADOR") {
          this.snackBar.open("No es posible eliminar a un administrador", 'AVISO', {duration : 2000});
        } else {
          let dialogRef = this.dialog.open(DialogoEliminarUsuarioComponent, {
            width : '400px',
            data : usuarioDto
          });
  
          dialogRef.afterClosed().subscribe(data => {
            if(data!=null && data>0) {
              this.cargarPermisosUsuario();
              this.snackBar.open("Usuario eliminado", 'AVISO', {duration : 2000});
            }
          });
        }
      }
    }
  }

  abrirDialogoEliminarVentana(ventanaTablaDTO : VentanaTablaDTO) {
    this.ventanaRolSeleccionado.ventana = new Ventana();
    this.ventanaRolSeleccionado.ventana.idVentana = ventanaTablaDTO.idVentana;
    this.ventanaRolSeleccionado.ventana.nombre = ventanaTablaDTO.ventana;
    if(this.ventanaRolSeleccionado.rol.nombre=="ADMINISTRADOR") {
      this.snackBar.open("No es posible modificar los permisos de un administrador", 'AVISO', {duration : 2000});
    } else {
      let dialogRef = this.dialog.open(DialogoEliminarVentanaComponent, {
        width : '400px',
        data: this.ventanaRolSeleccionado
      });
      dialogRef.afterClosed().subscribe(data => {
        if(data!=null && data>0) {
          this.cargarPermisosUsuario();
          this.snackBar.open("Permisos eliminados", 'AVISO', {duration : 2000});
        }
      });
    }
  }

  abrirDialogoEliminarPermiso(permiso : Permiso) {
    this.ventanaRolSeleccionado.permiso = permiso;
    if(this.ventanaRolSeleccionado.rol.nombre=="ADMINISTRADOR") {
      this.snackBar.open("No es posible modificar los permisos de un administrador", 'AVISO', {duration : 2000});
    } else {
      let dialogRef = this.dialog.open(DialogoEliminarPermisoComponent, {
        width : '400px',
        data: this.ventanaRolSeleccionado
      });
      dialogRef.afterClosed().subscribe(data => {
        if(data!=null && data>0) {
          this.cargarPermisosUsuario();
          this.snackBar.open("Permiso eliminado", 'AVISO', {duration : 2000});
        }
      });
    }
  }

  abrirDialogoEliminarTabla(tablaPermisoDTO : TablaPermisoDTO) {
    this.ventanaRolSeleccionado.tabla = new Tabla();
    this.ventanaRolSeleccionado.tabla.idTabla = tablaPermisoDTO.idTabla;
    this.ventanaRolSeleccionado.tabla.nombre = tablaPermisoDTO.tabla;
    if(this.ventanaRolSeleccionado.rol.nombre=="ADMINISTRADOR") {
      this.snackBar.open("No es posible modificar los permisos de un administrador", 'AVISO', {duration : 2000});
    } else {
      let dialogRef = this.dialog.open(DialogoEliminarTablaComponent, {
        width : '400px',
        data: this.ventanaRolSeleccionado
      });
      dialogRef.afterClosed().subscribe(data => {
        if(data!=null && data>0) {
          this.cargarPermisosUsuario();
          this.snackBar.open("Permisos eliminados", 'AVISO', {duration : 2000});
        }
      });
    }
  }
  
  evaluarAgregarPermisoBoton() {
    if(this.idUsuarioSeleccionado!=null && this.idUsuarioSeleccionado>0) {
      return false;
    }
    return true;
  }

  agregarPermiso() {
    for(let usuarioDto of this.usuariosDTO) {
      if(usuarioDto.idUsuario == this.idUsuarioSeleccionado) {
        if(usuarioDto.rol.nombre=="ADMINISTRADOR") {
          this.snackBar.open("No es posible modificar los permisos de un administrador", 'AVISO', {duration : 2000});
        } else {
          let dialogRef = this.dialog.open(DialogoAgregarPermisoComponent, {
            width : '900px',
            data : usuarioDto
          });
  
          dialogRef.afterClosed().subscribe(data => {
            if(data!=null && data>0) {
              this.cargarPermisosUsuario();
              this.snackBar.open("Permiso agregado", 'AVISO', {duration : 2000});
            }
          });
        }
      }
    }
  }

  cargarPermisosUsuario() {
    this.ventanaRolSeleccionado = new VentanaRol();
    this.idUsuarioSeleccionado = -1;
    this.dataSourceVentanasIn = new MatTableDataSource();
    this.dataSourceTablasIn = new MatTableDataSource();
    this.dataSourcePermisosIn = new MatTableDataSource();
    this.dataSourceUsuarios = new MatTableDataSource();
    this.usuarioService.getAllDTO().subscribe(data => {
      this.usuariosDTO = data;
      this.dataSourceUsuarios = new MatTableDataSource(this.usuariosDTO);
    });
  }

}
