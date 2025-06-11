import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { format } from 'date-fns';

export class EliminarAgendaResponse {
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

export interface EliminarAgendaState {
	lang: string,
	id: number,
    response: EliminarAgendaResponse[] | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarAgendaInitialState: EliminarAgendaState = {
	lang: 'es',
	id: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarAgendaLoading = createAction('[eliminarAgenda] eliminar agenda loading', props<{ lang: string, id: number }>());
export const eliminarAgendaSuccess = createAction('[eliminarAgenda] eliminar agenda success', props<{ response: EliminarAgendaResponse[] }>());
export const eliminarAgendaFail = createAction('[eliminarAgenda] eliminar agenda fail', props<{ payload: any }>());

export const EliminarAgendaReducer = createReducer(
    EliminarAgendaInitialState,
    on(eliminarAgendaLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarAgendaSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: response })),
    on(eliminarAgendaFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarAgendaEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarAgenda$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarAgendaLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/agenda/' + action.id)
            .pipe(
                map((response: any) => eliminarAgendaSuccess({ response: response })),
                catchError(err => of(eliminarAgendaFail({ payload: err })))
            )
        )
    ));
}
