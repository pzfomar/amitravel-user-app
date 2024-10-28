import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class NegocioProductos {
    public id: number;
	public nombre: string;
	public descripcion: string;
	public imagen: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface NegocioProductosState {
	lang: string,
	negocioId: number,
    datos: NegocioProductos[],
	loaded: boolean,
	loading: boolean,
    error: any
}

export const NegocioProductosInitialState: NegocioProductosState = {
	lang: 'es',
	negocioId: 0,
    datos: null,
	loaded: false,
	loading: false,
    error: null
}

export const negocioProductosLoading = createAction('[negocioProductos] negocio productos loading', props<{ lang: string, negocioId: number }>());
export const negocioProductosSuccess = createAction('[negocioProductos] negocio productos success', props<{ datos: NegocioProductos[] }>());
export const negocioProductosFail = createAction('[negocioProductos] negocio productos fail', props<{ payload: any }>());

export const NegocioProductosReducer = createReducer(
    NegocioProductosInitialState,
    on(negocioProductosLoading, (state, { lang, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, negocioId: negocioId }) ),
    on(negocioProductosSuccess, (state, { datos }) => ({ ...state, loading: false, loaded: true, datos: datos })),
    on(negocioProductosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class NegocioProductosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadNegocioProductos$ = createEffect(() => this.actions$.pipe(
        ofType(negocioProductosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/producto/negocio/' + action.negocioId)
            .pipe(
                map((datos: any) => negocioProductosSuccess({ datos: datos })),
                catchError(err => of(negocioProductosFail({ payload: err })))
            )
        )
    ));
}
