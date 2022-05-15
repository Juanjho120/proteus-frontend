import { Rol } from './../rol';
export class UsuarioRolDTO {
    idUsuario : number;
    nombre : string;
    apellido : string;
    username : string;
    email : string;
    telefono : string;
    estado : string;
    rol : Rol;
}