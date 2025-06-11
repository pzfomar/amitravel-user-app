import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class NegocioPromociones {
	public id: number;
    public negocioId: number;
	public nombre: string;
	public descripcion: string;
	public imagen: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface NegocioPromocionesState {
	lang: string,
	negocioId: number,
    datos: NegocioPromociones[],
	loaded: boolean,
	loading: boolean,
    error: any
}

export const NegocioPromocionesInitialState: NegocioPromocionesState = {
	lang: 'es',
	negocioId: 0,
    datos: null,
	loaded: false,
	loading: false,
    error: null
}

export const negocioPromocionesLoading = createAction('[negocioPromociones] negocio promociones loading', props<{ lang: string, negocioId: number }>());
export const negocioPromocionesSuccess = createAction('[negocioPromociones] negocio promociones success', props<{ datos: NegocioPromociones[] }>());
export const negocioPromocionesFail = createAction('[negocioPromociones] negocio promociones fail', props<{ payload: any }>());

export const NegocioPromocionesReducer = createReducer(
    NegocioPromocionesInitialState,
    on(negocioPromocionesLoading, (state, { lang, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, negocioId: negocioId }) ),
    on(negocioPromocionesSuccess, (state, { datos }) => ({ ...state, loading: false, loaded: true, datos: datos })),
    on(negocioPromocionesFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class NegocioPromocionesEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadNegocioPromociones$ = createEffect(() => this.actions$.pipe(
        ofType(negocioPromocionesLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/promocion/negocio/' + action.negocioId)
            .pipe(
                map((datos: any) => negocioPromocionesSuccess({ datos: datos })),
                catchError(err => of(negocioPromocionesFail({ payload: err })))
            )
        )
    ));
}
