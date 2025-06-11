import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class ObtenerEvento {
    public id: number;
    public negocioId: number;
	public nombre: string;
	public descripcion: string;
    public lugar: string;
    public mapa: string;
	public imagen: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface ObtenerEventoState {
	lang: string,
	id: number,
    dato: ObtenerEvento,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerEventoInitialState: ObtenerEventoState = {
	lang: 'es',
	id: 0,
    dato: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerEventoLoading = createAction('[obtenerEvento] cercanos evento loading', props<{ lang: string, id: number }>());
export const obtenerEventoSuccess = createAction('[obtenerEvento] cercanos evento success', props<{ dato: ObtenerEvento }>());
export const obtenerEventoFail = createAction('[obtenerEvento] cercanos evento fail', props<{ payload: any }>());

export const ObtenerEventoReducer = createReducer(
    ObtenerEventoInitialState,
    on(obtenerEventoLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(obtenerEventoSuccess, (state, { dato }) => ({ ...state, loading: false, loaded: true, dato: { ...dato } })),
    on(obtenerEventoFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerEventoEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerEvento$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerEventoLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/evento/' + action.id)
            .pipe(
                map((dato: any) => obtenerEventoSuccess({ dato: dato })),
                catchError(err => of(obtenerEventoFail({ payload: err })))
            )
        )
    ));
}
