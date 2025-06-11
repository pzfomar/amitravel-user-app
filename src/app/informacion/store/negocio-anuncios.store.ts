import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class NegocioAnuncios {
	public id: number;
    public negocioId: number;
	public nombre: string;
	public descripcion: string;
	public imagen: string;
	public url: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;    
}

export interface NegocioAnunciosState {
	lang: string,
	negocioId: number,
    datos: NegocioAnuncios[],
	loaded: boolean,
	loading: boolean,
    error: any
}

export const NegocioAnunciosInitialState: NegocioAnunciosState = {
	lang: 'es',
	negocioId: 0,
    datos: null,
	loaded: false,
	loading: false,
    error: null
}

export const negocioAnunciosLoading = createAction('[negocioAnuncios] negocio anuncios loading', props<{ lang: string, negocioId: number }>());
export const negocioAnunciosSuccess = createAction('[negocioAnuncios] negocio anuncios success', props<{ datos: NegocioAnuncios[] }>());
export const negocioAnunciosFail = createAction('[negocioAnuncios] negocio anuncios fail', props<{ payload: any }>());

export const NegocioAnunciosReducer = createReducer(
    NegocioAnunciosInitialState,
    on(negocioAnunciosLoading, (state, { lang, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, negocioId: negocioId }) ),
    on(negocioAnunciosSuccess, (state, { datos }) => ({ ...state, loading: false, loaded: true, datos: datos })),
    on(negocioAnunciosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class NegocioAnunciosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadNegocioAnuncios$ = createEffect(() => this.actions$.pipe(
        ofType(negocioAnunciosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/anuncio/negocio/' + action.negocioId)
            .pipe(
                map((datos: any) => negocioAnunciosSuccess({ datos: datos })),
                catchError(err => of(negocioAnunciosFail({ payload: err })))
            )
        )
    ));
}
