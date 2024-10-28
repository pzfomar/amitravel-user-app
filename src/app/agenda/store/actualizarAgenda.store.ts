import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class ActualizarAgendaRequest {
	public id: number;
	public usuarioId: number;
	public eventoId: number;
	public nombre: string;
	public descripcion: string;
	public fecha: string;
	public hora: string;
}

export class ActualizarAgendaResponse {
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

export interface ActualizarAgendaState {
	lang: string,
	id: number,
	request: ActualizarAgendaRequest,
    response: ActualizarAgendaResponse | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarAgendaInitialState: ActualizarAgendaState = {
	lang: 'es',
	id: null,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarAgendaLoading = createAction('[actualizarAgenda] actualizar agenda loading', props<{ lang: string, id: number, request: ActualizarAgendaRequest }>());
export const actualizarAgendaSuccess = createAction('[actualizarAgenda] actualizar agenda success', props<{ response: ActualizarAgendaResponse }>());
export const actualizarAgendaFail = createAction('[actualizarAgenda] actualizar agenda fail', props<{ payload: any }>());

export const ActualizarAgendaReducer = createReducer(
    ActualizarAgendaInitialState,
    on(actualizarAgendaLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarAgendaSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarAgendaFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarAgendaEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarAgenda$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarAgendaLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/agenda/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarAgendaSuccess({ response: response })),
                catchError(err => of(actualizarAgendaFail({ payload: err })))
            )
        )
    ));
}
