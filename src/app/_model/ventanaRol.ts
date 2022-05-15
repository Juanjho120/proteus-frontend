import { Permiso } from './permiso';
import { Tabla } from './tabla';
import { Rol } from './rol';
import { Ventana } from './ventana';
export class VentanaRol {
    idVentanaRol : number;
    ventana : Ventana;
    rol : Rol;
    tabla : Tabla;
    permiso : Permiso;
}