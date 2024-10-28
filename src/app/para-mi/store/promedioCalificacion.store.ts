import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface PromedioCalificacionState {
	lang: string,
	eventoId: number,
    response: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const PromedioCalificacionInitialState: PromedioCalificacionState = {
	lang: 'es',
	eventoId: 0,
    response: 0,
	loaded: false,
	loading: false,
    error: null
}

export const promedioCalificacionLoading = createAction('[promedioCalificacion] obtener calificaciones loading', props<{ lang: string, eventoId: number }>());
export const promedioCalificacionSuccess = createAction('[promedioCalificacion] obtener calificaciones success', props<{ response: number }>());
export const promedioCalificacionFail = createAction('[promedioCalificacion] obtener calificaciones fail', props<{ payload: any }>());

export const PromedioCalificacionReducer = createReducer(
    PromedioCalificacionInitialState,
    on(promedioCalificacionLoading, (state, { lang, eventoId }) => ({ ...state, loading: true, loaded: false, lang: lang, eventoId: eventoId }) ),
    on(promedioCalificacionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: response })),
    on(promedioCalificacionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class PromedioCalificacionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadPromedioCalificacion$ = createEffect(() => this.actions$.pipe(
        ofType(promedioCalificacionLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/calificacion/promedio/evento/' + action.eventoId)
            .pipe(
                map((response: any) => promedioCalificacionSuccess({ response: response })),
                catchError(err => of(promedioCalificacionFail({ payload: err })))
            )
        )
    ));
}
