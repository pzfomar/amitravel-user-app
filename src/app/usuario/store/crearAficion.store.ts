import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class CrearAficionRequest {
    public usuarioId: number;
    public movilidad: string;
    public sitio: string;
    public presupuesto: number;
    public horarioActividad: string;
}

export class CrearAficionResponse {
    public id: number;
    public usuarioId: number;
    public movilidad: string;
    public sitio: string;
    public presupuesto: number;
    public horarioActividad: string;
    public estatus: boolean;
    public creacion: Date;
    public actualizacion: Date;
}

export interface CrearAficionState {
	lang: string,
	request: CrearAficionRequest,
    response: CrearAficionResponse | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearAficionInitialState: CrearAficionState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearAficionLoading = createAction('[crearAficion] crear aficion loading', props<{ lang: string, request: CrearAficionRequest }>());
export const crearAficionSuccess = createAction('[crearAficion] crear aficion success', props<{ response: CrearAficionResponse }>());
export const crearAficionFail = createAction('[crearAficion] crear aficion fail', props<{ payload: any }>());

export const CrearAficionReducer = createReducer(
    CrearAficionInitialState,
    on(crearAficionLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearAficionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearAficionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearAficionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearAficion$ = createEffect(() => this.actions$.pipe(
        ofType(crearAficionLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/aficion', action.request)
            .pipe(
                map((response: any) => crearAficionSuccess({ response: response })),
                catchError(err => of(crearAficionFail({ payload: err })))
            )
        )
    ));
}
