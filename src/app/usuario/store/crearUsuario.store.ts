import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class CrearUsuarioRequest {
	public apodo: string;
	public contrasenia: string;
}

export class CrearUsuarioResponse {
	public id: number;
	public apodo: string;
	public rol: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface CrearUsuarioState {
	lang: string,
	request: CrearUsuarioRequest,
    response: CrearUsuarioResponse | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearUsuarioInitialState: CrearUsuarioState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearUsuarioLoading = createAction('[crearUsuario] crear usuario loading', props<{ lang: string, request: CrearUsuarioRequest }>());
export const crearUsuarioSuccess = createAction('[crearUsuario] crear usuario success', props<{ response: CrearUsuarioResponse }>());
export const crearUsuarioFail = createAction('[crearUsuario] crear usuario fail', props<{ payload: any }>());

export const CrearUsuarioReducer = createReducer(
    CrearUsuarioInitialState,
    on(crearUsuarioLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearUsuarioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearUsuarioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearUsuarioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearUsuario$ = createEffect(() => this.actions$.pipe(
        ofType(crearUsuarioLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/usuario', action.request)
            .pipe(
                map((response: any) => crearUsuarioSuccess({ response: response })),
                catchError(err => of(crearUsuarioFail({ payload: err })))
            )
        )
    ));
}
