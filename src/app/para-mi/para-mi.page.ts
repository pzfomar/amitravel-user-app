import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { format, parseISO } from 'date-fns';
import { lang } from './para-mi.lang';
import { ContenidoCercano, contenidoCercanoLoading } from './store/contenido-cercano.store';
import { AppState } from './store/store';
import { Storage } from '@capacitor/storage';
import { crearAgendaLoading, CrearAgendaRequest } from './store/crearAgenda.store';
import { CalificacionesComponent } from './calificaciones/calificaciones.component';
import { promedioCalificacionLoading } from './store/promedioCalificacion.store';

@Component({
  selector: 'app-para-mi',
  templateUrl: './para-mi.page.html',
  styleUrls: ['./para-mi.page.scss'],
})
export class ParaMiPage implements OnInit {

  texto = lang.es;
  dato: ContenidoCercano;
  datos: ContenidoCercano[];
  pagina: number = 0;
  usuarioId: number;
  evaluacion: number = 0;

  constructor(private store: Store<AppState>, private alertController: AlertController, private modalController: ModalController) { }

  async ngOnInit() {
    this.store.select('contenidoCercano').subscribe(s => {
      if (s.datos) {
        this.datos = (!this.datos)? s.datos: this.datos.concat(s.datos);
        this.dato = this.datos[this.pagina];
        this.store.dispatch(promedioCalificacionLoading({ lang: 'es', eventoId: this.dato.id }));
      }
    });

    this.store.select('crearAgenda').subscribe(s => {
      if (s.response && this.usuarioId) {
      }
    });

    this.store.select('promedioCalificacion').subscribe(s => {
      this.evaluacion = s.response;
    });

    this.store.dispatch(contenidoCercanoLoading({ lang: 'es', latitud: 0, longitud: 0 }));

    let usuarioId = await Storage.get({ key: 'usuarioId' });
    this.usuarioId = (usuarioId.value)? Number(usuarioId.value): undefined;
  }

  continuar(pagina: number) {
    this.pagina += pagina;
    if (this.pagina == (this.datos.length - 1)) {
      this.store.dispatch(contenidoCercanoLoading({ lang: 'es', latitud: 0, longitud: 0 }));
    }
    this.dato = this.datos[this.pagina];
    this.store.dispatch(promedioCalificacionLoading({ lang: 'es', eventoId: this.dato.id }));
  }

  refrescar(event) {
    this.dato = null;
    this.store.dispatch(contenidoCercanoLoading({ lang: 'es', latitud: 0, longitud: 0 }));
    event.target.complete();
  }

  async imagen(url: string) {
    const alert = await this.alertController.create({
      header: 'boo',
      message: '<img src="' + url + '" class="card-alert">'
    })
    await alert.present();
  }

  async agendar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.texto.agendar,
      inputs: [
        {
          name: 'titulo',
          id: 'titulo',
          type: 'text',
          value: this.dato.nombre,
          placeholder: this.texto.titulo
        },
        {
          name: 'descripcion',
          id: 'descripcion',
          type: 'textarea',
          value: this.dato.descripcion,
          placeholder: this.texto.descripcion
        },
        {
          name: 'fecha',
          id: 'fecha',
          type: 'datetime-local',
          value: format(new Date(), 'yyyy-MM-dd') + 'T' + format(new Date(), 'HH:mm')
        }
      ],
      buttons: [
        {
          text: this.texto.cancelar,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: this.texto.confirmar,
          handler: (value) => {
            if (!this.usuarioId || !value.titulo || !value.descripcion || !value.fecha) {
              return false;
            }
            
            let request = new CrearAgendaRequest();
            request.nombre = value.titulo;
            request.descripcion = value.descripcion;
            request.fecha = format(parseISO(value.fecha), 'yyyy-MM-dd');
            request.hora = format(parseISO(value.fecha), 'HH:mm:ss');
            request.usuarioId = this.usuarioId;
            request.eventoId = this.dato.id
            this.store.dispatch(crearAgendaLoading({ lang: 'es', request: request }));
          }
        }
      ]
    });
    await alert.present();
  }

  async verCalificacion() {
    const modal = await this.modalController.create({
      component: CalificacionesComponent,
      componentProps: {
        eventoId: this.dato.id
      },
    });
    modal.present();
    
    const { role } = await modal.onWillDismiss();
    if (role === 'cerrar') {
    }
  }
}
