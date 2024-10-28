import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { format } from 'date-fns';

export class ObtenerAgendaResponse {
	public id: number;
	public usuarioId: number;
	public eventoId: number;
	public nombre: string;
	public descripcion: string;
	public fecha: string;
	public hora: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface ObtenerAgendaState {
	lang: string,
	usuarioId: number,
    fecha: Date,
    response: ObtenerAgendaResponse[] | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerAgendaInitialState: ObtenerAgendaState = {
	lang: 'es',
	usuarioId: null,
    fecha: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerAgendaLoading = createAction('[obtenerAgenda] obtener agenda loading', props<{ lang: string, usuarioId: number, fecha: Date }>());
export const obtenerAgendaSuccess = createAction('[obtenerAgenda] obtener agenda success', props<{ response: ObtenerAgendaResponse[] }>());
export const obtenerAgendaFail = createAction('[obtenerAgenda] obtener agenda fail', props<{ payload: any }>());

export const ObtenerAgendaReducer = createReducer(
    ObtenerAgendaInitialState,
    on(obtenerAgendaLoading, (state, { lang, usuarioId, fecha }) => ({ ...state, loading: true, loaded: false, lang: lang, usuarioId: usuarioId, fecha: fecha }) ),
    on(obtenerAgendaSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: response })),
    on(obtenerAgendaFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerAgendaEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerAgenda$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerAgendaLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/agenda/usuario/' + action.usuarioId + '/fecha/' + format(action.fecha, 'yyyy-MM-dd'))
            .pipe(
                map((response: any) => obtenerAgendaSuccess({ response: response })),
                catchError(err => of(obtenerAgendaFail({ payload: err })))
            )
        )
    ));
}
