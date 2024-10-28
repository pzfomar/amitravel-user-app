import { ActionReducerMap } from '@ngrx/store';
import { CrearAgendaEffects, CrearAgendaReducer, CrearAgendaState } from './crearAgenda.store';
import { ObtenerAgendaEffects, ObtenerAgendaReducer, ObtenerAgendaState } from './obtenerAgenda.store';
import { ActualizarAgendaEffects, ActualizarAgendaReducer, ActualizarAgendaState } from './actualizarAgenda.store';
import { EliminarAgendaEffects, EliminarAgendaReducer, EliminarAgendaState } from './eliminarAgenda.store';

export interface AppState {
    crearAgenda: CrearAgendaState,
    obtenerAgenda: ObtenerAgendaState,
    actualizarAgenda: ActualizarAgendaState,
    eliminarAgenda: EliminarAgendaState,
}

export const appReducers: ActionReducerMap<AppState> = {
    crearAgenda: CrearAgendaReducer,
    obtenerAgenda: ObtenerAgendaReducer,
    actualizarAgenda: ActualizarAgendaReducer,
    eliminarAgenda: EliminarAgendaReducer,
}

export const EffectsArray: any[] = [
    CrearAgendaEffects,
    ObtenerAgendaEffects,
    ActualizarAgendaEffects,
    EliminarAgendaEffects,
];
