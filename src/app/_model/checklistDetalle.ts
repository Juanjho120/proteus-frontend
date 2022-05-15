import { ChecklistEvaluacion } from './checklistEvaluacion';
import { ChecklistItem } from './checklistItem';
export class ChecklistDetalle {
    idChecklistDetalle : number;
    checklistItem : ChecklistItem;
    checklistEvaluacion : ChecklistEvaluacion;
    electrico : boolean;
}