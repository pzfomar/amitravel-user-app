import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface RecuperaUsuarioState {
	lang: string,
	apodo: string,
    response: any,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const RecuperaUsuarioInitialState: RecuperaUsuarioState = {
	lang: 'es',
	apodo: '',
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const recuperaUsuarioLoading = createAction('[recuperaUsuario] recupera usuario loading', props<{ lang: string, apodo: string }>());
export const recuperaUsuarioSuccess = createAction('[recuperaUsuario] recupera usuario success', props<{ response: any }>());
export const recuperaUsuarioFail = createAction('[recuperaUsuario] recupera usuario fail', props<{ payload: any }>());

export const RecuperaUsuarioReducer = createReducer(
    RecuperaUsuarioInitialState,
    on(recuperaUsuarioLoading, (state, { lang, apodo }) => ({ ...state, loading: true, loaded: false, lang: lang, apodo: apodo }) ),
    on(recuperaUsuarioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: response })),
    on(recuperaUsuarioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class RecuperaUsuarioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadRecuperaUsuario$ = createEffect(() => this.actions$.pipe(
        ofType(recuperaUsuarioLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/usuario/recupera/' + action.apodo)
            .pipe(
                map((response: any) => recuperaUsuarioSuccess({ response: response })),
                catchError(err => of(recuperaUsuarioFail({ payload: err })))
            )
        )
    ));
}
