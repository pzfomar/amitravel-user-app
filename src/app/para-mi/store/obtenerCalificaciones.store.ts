import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class ObtenerCalificacionesResponse {
    public id: number;
    public usuarioId: number;
    public eventoId: number;
    public servicioId: number;
    public evaluacion: number;
    public comentario: string;
    public estatus: boolean;
    public creacion: Date;
    public actualizacion: Date;
}

export interface ObtenerCalificacionesState {
	lang: string,
	eventoId: number,
    response: ObtenerCalificacionesResponse[],
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerCalificacionesInitialState: ObtenerCalificacionesState = {
	lang: 'es',
	eventoId: 0,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerCalificacionesLoading = createAction('[obtenerCalificaciones] obtener calificaciones loading', props<{ lang: string, eventoId: number }>());
export const obtenerCalificacionesSuccess = createAction('[obtenerCalificaciones] obtener calificaciones success', props<{ response: ObtenerCalificacionesResponse[] }>());
export const obtenerCalificacionesFail = createAction('[obtenerCalificaciones] obtener calificaciones fail', props<{ payload: any }>());

export const ObtenerCalificacionesReducer = createReducer(
    ObtenerCalificacionesInitialState,
    on(obtenerCalificacionesLoading, (state, { lang, eventoId }) => ({ ...state, loading: true, loaded: false, lang: lang, eventoId: eventoId }) ),
    on(obtenerCalificacionesSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: response })),
    on(obtenerCalificacionesFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerCalificacionesEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerCalificaciones$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerCalificacionesLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/calificacion/evento/' + action.eventoId)
            .pipe(
                map((response: any) => obtenerCalificacionesSuccess({ response: response })),
                catchError(err => of(obtenerCalificacionesFail({ payload: err })))
            )
        )
    ));
}
