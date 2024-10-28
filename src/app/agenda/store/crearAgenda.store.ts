import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class CrearAgendaRequest {
	public id: number;
	public usuarioId: number;
	public eventoId: number;
	public nombre: string;
	public descripcion: string;
	public fecha: string;
	public hora: string;
}

export class CrearAgendaResponse {
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

export interface CrearAgendaState {
	lang: string,
	request: CrearAgendaRequest,
    response: CrearAgendaResponse | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearAgendaInitialState: CrearAgendaState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearAgendaLoading = createAction('[crearAgenda] crear agenda loading', props<{ lang: string, request: CrearAgendaRequest }>());
export const crearAgendaSuccess = createAction('[crearAgenda] crear agenda success', props<{ response: CrearAgendaResponse }>());
export const crearAgendaFail = createAction('[crearAgenda] crear agenda fail', props<{ payload: any }>());

export const CrearAgendaReducer = createReducer(
    CrearAgendaInitialState,
    on(crearAgendaLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearAgendaSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearAgendaFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearAgendaEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearAgenda$ = createEffect(() => this.actions$.pipe(
        ofType(crearAgendaLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/agenda', action.request)
            .pipe(
                map((response: any) => crearAgendaSuccess({ response: response })),
                catchError(err => of(crearAgendaFail({ payload: err })))
            )
        )
    ));
}
