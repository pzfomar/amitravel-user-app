import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class ObtenerAficionResponse {
    public id: number;
    public usuarioId: number;
    public movilidad: string;
    public sitio: string;
    public presupuesto: number;
    public horarioActividad: string;
    public estatus: boolean;
    public creacion: Date;
    public actualizacion: Date;
}

export interface ObtenerAficionState {
	lang: string,
	usuarioId: number,
    response: ObtenerAficionResponse[] | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerAficionInitialState: ObtenerAficionState = {
	lang: 'es',
	usuarioId: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerAficionLoading = createAction('[obtenerAficion] obtener aficion loading', props<{ lang: string, usuarioId: number }>());
export const obtenerAficionSuccess = createAction('[obtenerAficion] obtener aficion success', props<{ response: ObtenerAficionResponse[] }>());
export const obtenerAficionFail = createAction('[obtenerAficion] obtener aficion fail', props<{ payload: any }>());

export const ObtenerAficionReducer = createReducer(
    ObtenerAficionInitialState,
    on(obtenerAficionLoading, (state, { lang, usuarioId }) => ({ ...state, loading: true, loaded: false, lang: lang, usuarioId: usuarioId }) ),
    on(obtenerAficionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: response })),
    on(obtenerAficionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerAficionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerAficion$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerAficionLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/aficion/usuario/' + action.usuarioId)
            .pipe(
                map((response: any) => obtenerAficionSuccess({ response: response })),
                catchError(err => of(obtenerAficionFail({ payload: err })))
            )
        )
    ));
}
