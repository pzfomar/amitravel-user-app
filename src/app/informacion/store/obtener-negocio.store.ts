import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class ObtenerNegocio {
    public id: number;
    public negocioId: number;
	public nombre: string;
	public descripcion: string;
	public tipo: string;
    public lugar: string;
    public mapa: string;
	public imagen: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface ObtenerNegocioState {
	lang: string,
	id: number,
    dato: ObtenerNegocio,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerNegocioInitialState: ObtenerNegocioState = {
	lang: 'es',
	id: 0,
    dato: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerNegocioLoading = createAction('[obtenerNegocio] cercanos negocio loading', props<{ lang: string, id: number }>());
export const obtenerNegocioSuccess = createAction('[obtenerNegocio] cercanos negocio success', props<{ dato: ObtenerNegocio }>());
export const obtenerNegocioFail = createAction('[obtenerNegocio] cercanos negocio fail', props<{ payload: any }>());

export const ObtenerNegocioReducer = createReducer(
    ObtenerNegocioInitialState,
    on(obtenerNegocioLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(obtenerNegocioSuccess, (state, { dato }) => ({ ...state, loading: false, loaded: true, dato: { ...dato } })),
    on(obtenerNegocioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerNegocioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerNegocio$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerNegocioLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/negocio/' + action.id)
            .pipe(
                map((dato: any) => obtenerNegocioSuccess({ dato: dato })),
                catchError(err => of(obtenerNegocioFail({ payload: err })))
            )
        )
    ));
}
