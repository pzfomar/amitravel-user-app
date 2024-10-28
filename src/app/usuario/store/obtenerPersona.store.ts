import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class ObtenerPersonaResponse {
	public id: number;
	public usuarioId: any;
	public correo: string;
	public nombre: string;
	public apellidoPaterno: string;
	public apellidoMaterno: string;
	public edad: number;
	public telefono: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface ObtenerPersonaState {
	lang: string,
	usuarioId: number,
    response: ObtenerPersonaResponse | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerPersonaInitialState: ObtenerPersonaState = {
	lang: 'es',
	usuarioId: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerPersonaLoading = createAction('[obtenerPersona] obtener persona loading', props<{ lang: string, usuarioId: number }>());
export const obtenerPersonaSuccess = createAction('[obtenerPersona] obtener persona success', props<{ response: ObtenerPersonaResponse }>());
export const obtenerPersonaFail = createAction('[obtenerPersona] obtener persona fail', props<{ payload: any }>());

export const ObtenerPersonaReducer = createReducer(
    ObtenerPersonaInitialState,
    on(obtenerPersonaLoading, (state, { lang, usuarioId }) => ({ ...state, loading: true, loaded: false, lang: lang, usuarioId: usuarioId }) ),
    on(obtenerPersonaSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(obtenerPersonaFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerPersonaEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerPersona$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerPersonaLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/persona/usuario/' + action.usuarioId)
            .pipe(
                map((response: any) => obtenerPersonaSuccess({ response: response })),
                catchError(err => of(obtenerPersonaFail({ payload: err })))
            )
        )
    ));
}
