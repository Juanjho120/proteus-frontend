import { ChecklistDetalle } from './checklistDetalle';
import { Usuario } from './usuario';
import { Personal } from './personal';
import { Servicio } from './servicio';
import { ChecklistServicioTipo } from './checklistServicioTipo';
export class Checklist {
    idChecklist : number;
    checklistServicioTipo : ChecklistServicioTipo;
    servicio : Servicio;
    mecanico : Personal;
    supervisor : Personal;
    usuarioIngreso : Usuario;
    fechaHoraIngreso : string;
    fechaRevision : string;
    noOrdenTrabajo : string;
    observaciones : string;
    checklistDetalle : ChecklistDetalle[];
}