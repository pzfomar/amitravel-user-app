import { ActionReducerMap } from '@ngrx/store';
import { CrearAgendaEffects, CrearAgendaReducer, CrearAgendaState } from './crearAgenda.store';
import { ContenidoCercanoEffects, ContenidoCercanoReducer, ContenidoCercanoState } from './contenido-cercano.store';
import { CrearCalificacionEffects, CrearCalificacionReducer, CrearCalificacionState } from './crearCalificacion.store';
import { ObtenerCalificacionesEffects, ObtenerCalificacionesReducer, ObtenerCalificacionesState } from './obtenerCalificaciones.store';
import { PromedioCalificacionEffects, PromedioCalificacionReducer, PromedioCalificacionState } from './promedioCalificacion.store';

export interface AppState {
    crearAgenda: CrearAgendaState,
    contenidoCercano: ContenidoCercanoState,
    crearCalificacion: CrearCalificacionState,
    obtenerCalificaciones: ObtenerCalificacionesState,
    promedioCalificacion: PromedioCalificacionState,
}

export const appReducers: ActionReducerMap<AppState> = {
    crearAgenda: CrearAgendaReducer,
    contenidoCercano: ContenidoCercanoReducer,
    crearCalificacion: CrearCalificacionReducer,
    obtenerCalificaciones: ObtenerCalificacionesReducer,
    promedioCalificacion: PromedioCalificacionReducer,
}

export const EffectsArray: any[] = [
    CrearAgendaEffects,
    ContenidoCercanoEffects,
    CrearCalificacionEffects,
    ObtenerCalificacionesEffects,
    PromedioCalificacionEffects,
];
