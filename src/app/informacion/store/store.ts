import { ActionReducerMap } from '@ngrx/store';
import { ObtenerEventoEffects, ObtenerEventoReducer, ObtenerEventoState } from './obtener-evento.store';
import { ObtenerNegocioEffects, ObtenerNegocioReducer, ObtenerNegocioState } from './obtener-negocio.store';
import { NegocioAnunciosEffects, NegocioAnunciosReducer, NegocioAnunciosState } from './negocio-anuncios.store';
import { NegocioProductosEffects, NegocioProductosReducer, NegocioProductosState } from './negocio-productos.store';
import { NegocioPromocionesEffects, NegocioPromocionesReducer, NegocioPromocionesState } from './negocio-promociones.store';

export interface AppState {
    obtenerEvento: ObtenerEventoState,
    obtenerNegocio: ObtenerNegocioState,
    negocioAnuncios: NegocioAnunciosState,
    negocioProductos: NegocioProductosState,
    negocioPromociones: NegocioPromocionesState,
}

export const appReducers: ActionReducerMap<AppState> = {
    obtenerEvento: ObtenerEventoReducer,
    obtenerNegocio: ObtenerNegocioReducer,
    negocioAnuncios: NegocioAnunciosReducer,
    negocioProductos: NegocioProductosReducer,
    negocioPromociones: NegocioPromocionesReducer,
}

export const EffectsArray: any[] = [
    ObtenerEventoEffects,
    ObtenerNegocioEffects,
    NegocioAnunciosEffects,
    NegocioProductosEffects,
    NegocioPromocionesEffects,
];
