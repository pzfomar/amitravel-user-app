import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { lang } from './informacion.lang';
import { NegocioAnuncios, negocioAnunciosLoading } from './store/negocio-anuncios.store';
import { NegocioProductos, negocioProductosLoading } from './store/negocio-productos.store';
import { NegocioPromociones, negocioPromocionesLoading } from './store/negocio-promociones.store';
import { obtenerEventoLoading } from './store/obtener-evento.store';
import { ObtenerNegocio, obtenerNegocioLoading } from './store/obtener-negocio.store';
import { AppState } from './store/store';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  texto = lang.es;
  tab: string;
  dato: { imagen: string; mapa: string; };
  negocio: ObtenerNegocio;
  anuncios: NegocioAnuncios[];
  promociones: NegocioPromociones[];
  productos: NegocioProductos[];

  constructor(private store: Store<AppState>, private sanitizer: DomSanitizer, private route: ActivatedRoute) { }

  ngOnInit() {
    this.store.select('obtenerEvento').subscribe(s => {
      if (s.dato) {
        this.dato = { imagen: s.dato.imagen, mapa: s.dato.mapa };
        this.store.dispatch(obtenerNegocioLoading({ lang: 'es', id: s.dato.negocioId }));
        this.store.dispatch(negocioAnunciosLoading({ lang: 'es', negocioId: s.dato.negocioId }));
        this.store.dispatch(negocioProductosLoading({ lang: 'es', negocioId: s.dato.negocioId }));
        this.store.dispatch(negocioPromocionesLoading({ lang: 'es', negocioId: s.dato.negocioId }));
      }
    });
    this.store.select('obtenerNegocio').subscribe(s => {
      if (s.dato) {
        this.negocio = s.dato;
      }
    });
    this.store.select('negocioAnuncios').subscribe(s => {
      if (s.datos) {
        this.anuncios = s.datos;
      }
    });
    this.store.select('negocioProductos').subscribe(s => {
      if (s.datos) {
        this.productos = s.datos;
      }
    });
    this.store.select('negocioPromociones').subscribe(s => {
      if (s.datos) {
        this.promociones = s.datos;
      }
    });
    
    this.store.dispatch(obtenerEventoLoading({ lang: 'es', id: Number(this.route.snapshot.paramMap.get('id')) }));
    this.tab = this.route.snapshot.paramMap.get('seccion');
  }

  transform(map: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(map);
  }
}
