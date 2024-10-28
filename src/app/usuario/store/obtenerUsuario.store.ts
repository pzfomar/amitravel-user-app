import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class ObtenerUsuarioResponse {
	public id: number;
	public apodo: string;
	public rol: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface ObtenerUsuarioState {
	lang: string,
	id: number,
    response: ObtenerUsuarioResponse | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerUsuarioInitialState: ObtenerUsuarioState = {
	lang: 'es',
	id: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerUsuarioLoading = createAction('[obtenerUsuario] obtener usuario loading', props<{ lang: string, id: number }>());
export const obtenerUsuarioSuccess = createAction('[obtenerUsuario] obtener usuario success', props<{ response: ObtenerUsuarioResponse }>());
export const obtenerUsuarioFail = createAction('[obtenerUsuario] obtener usuario fail', props<{ payload: any }>());

export const ObtenerUsuarioReducer = createReducer(
    ObtenerUsuarioInitialState,
    on(obtenerUsuarioLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(obtenerUsuarioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(obtenerUsuarioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerUsuarioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerUsuario$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerUsuarioLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/usuario/' + action.id)
            .pipe(
                map((response: any) => obtenerUsuarioSuccess({ response: response })),
                catchError(err => of(obtenerUsuarioFail({ payload: err })))
            )
        )
    ));
}
