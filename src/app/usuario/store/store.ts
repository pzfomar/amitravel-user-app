import { ActionReducerMap } from '@ngrx/store';
import { CrearUsuarioEffects, CrearUsuarioReducer, CrearUsuarioState } from './crearUsuario.store';
import { ObtenerUsuarioEffects, ObtenerUsuarioReducer, ObtenerUsuarioState } from './obtenerUsuario.store';
import { CrearPersonaEffects, CrearPersonaReducer, CrearPersonaState } from './crearPersona.store';
import { ObtenerPersonaEffects, ObtenerPersonaReducer, ObtenerPersonaState } from './obtenerPersona.store';
import { AuthoUsuarioEffects, AuthoUsuarioReducer, AuthoUsuarioState } from './authoUsuario.store';
import { CrearAficionEffects, CrearAficionReducer, CrearAficionState } from './crearAficion.store';
import { ObtenerAficionEffects, ObtenerAficionReducer, ObtenerAficionState } from './obtenerAficion.store';
import { RecuperaUsuarioEffects, RecuperaUsuarioReducer, RecuperaUsuarioState } from './recuperaUsuario.store';

export interface AppState {
    crearUsuario: CrearUsuarioState,
    crearPersona: CrearPersonaState,
    obtenerUsuario: ObtenerUsuarioState,
    obtenerPersona: ObtenerPersonaState,
    authoUsuario: AuthoUsuarioState,
    obtenerAficion: ObtenerAficionState,
    crearAficion: CrearAficionState,
    recuperaUsuario: RecuperaUsuarioState,
}

export const appReducers: ActionReducerMap<AppState> = {
    crearUsuario: CrearUsuarioReducer,
    crearPersona: CrearPersonaReducer,
    obtenerUsuario: ObtenerUsuarioReducer,
    obtenerPersona: ObtenerPersonaReducer,
    authoUsuario: AuthoUsuarioReducer,
    obtenerAficion: ObtenerAficionReducer,
    crearAficion: CrearAficionReducer,
    recuperaUsuario: RecuperaUsuarioReducer,
}

export const EffectsArray: any[] = [
    CrearUsuarioEffects,
    CrearPersonaEffects,
    ObtenerUsuarioEffects,
    ObtenerPersonaEffects,
    AuthoUsuarioEffects,
    ObtenerAficionEffects,
    CrearAficionEffects,
    RecuperaUsuarioEffects,
];
