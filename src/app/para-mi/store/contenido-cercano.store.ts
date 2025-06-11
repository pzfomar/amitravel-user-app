import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class ContenidoCercano {
    public id: number;
    public tipo: string;
    public logo: string;
    public nombre: string;
    public descripcion: string;
    public imagen: string;
}

export interface ContenidoCercanoState {
	lang: string,
	longitud: number,
	latitud: number,
    datos: ContenidoCercano[],
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ContenidoCercanoInitialState: ContenidoCercanoState = {
	lang: 'es',
	longitud: 0,
	latitud: 0,
    datos: null,
	loaded: false,
	loading: false,
    error: null
}

export const contenidoCercanoLoading = createAction('[contenidoCercano] contenido cercano loading', props<{ lang: string, longitud: number, latitud: number }>());
export const contenidoCercanoSuccess = createAction('[contenidoCercano] contenido cercano success', props<{ datos: ContenidoCercano[] }>());
export const contenidoCercanoFail = createAction('[contenidoCercano] contenido cercano fail', props<{ payload: any }>());

export const ContenidoCercanoReducer = createReducer(
    ContenidoCercanoInitialState,
    on(contenidoCercanoLoading, (state, { lang, longitud, latitud }) => ({ ...state, loading: true, loaded: false, lang: lang, longitud: longitud, latitud: latitud }) ),
    on(contenidoCercanoSuccess, (state, { datos }) => ({ ...state, loading: false, loaded: true, datos: datos })),
    on(contenidoCercanoFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ContenidoCercanoEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadContenidoCercano$ = createEffect(() => this.actions$.pipe(
        ofType(contenidoCercanoLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/contenido/cercano/' + action.longitud + '/' + action.latitud)
            .pipe(
                map((datos: any) => contenidoCercanoSuccess({ datos: datos })),
                catchError(err => of(contenidoCercanoFail({ payload: err })))
            )
        )
    ));
}
