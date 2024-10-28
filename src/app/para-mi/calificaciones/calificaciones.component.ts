import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { obtenerCalificacionesLoading, ObtenerCalificacionesResponse } from '../store/obtenerCalificaciones.store';
import { Storage } from '@capacitor/storage';
import { AppState } from '../store/store';
import { crearCalificacionLoading, CrearCalificacionRequest } from '../store/crearCalificacion.store';
import { lang } from './calificaciones.lang';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.scss'],
})
export class CalificacionesComponent implements OnInit {

  texto = lang.es;
  eventoId: number;
  calificaciones: ObtenerCalificacionesResponse[];
  usuarioId: number;

  constructor(private store: Store<AppState>, private modalController: ModalController, private alertController: AlertController) {}

  async ngOnInit() {
    this.store.select('obtenerCalificaciones').subscribe(s => {
      if (s.response) {
        this.calificaciones = s.response;
      }
    });

    this.store.select('crearCalificacion').subscribe(s => {
      if (s.response) {
        this.store.dispatch(obtenerCalificacionesLoading({ lang: 'es', eventoId: this.eventoId }));
      }
    });

    this.store.dispatch(obtenerCalificacionesLoading({ lang: 'es', eventoId: this.eventoId }));
    
    let usuarioId = await Storage.get({ key: 'usuarioId' });
    if (usuarioId.value) {
      this.usuarioId = Number(usuarioId.value);
    }
  }

  async calificar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.texto.calificacion,
      inputs: [
        {
          name: 'evaluacion',
          id: 'evaluacion',
          min: 0,
          max: 3,
          type: 'number',
          placeholder: this.texto.evaluacion
        },
        {
          name: 'comentario',
          id: 'comentario',
          type: 'textarea',
          placeholder: this.texto.comentario
        },
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
            if (!this.usuarioId || !this.eventoId || !value.evaluacion || value.evaluacion < 0 || value.evaluacion > 3 || !value.comentario) {
              return false;
            }
            let request = new CrearCalificacionRequest();
            request.usuarioId = this.usuarioId;
            request.eventoId = this.eventoId;
            request.evaluacion = value.evaluacion;
            request.comentario = value.comentario;
            this.store.dispatch(crearCalificacionLoading({ lang: 'es', request: request }));
          }
        }
      ]
    });
    await alert.present();    
  }

  cerrar() {
    return this.modalController.dismiss(null, 'cerrar');
  }

  async descripcionCalificacion(calificacion) {
    const alert = await this.alertController.create({
      header: this.texto.evaluacion + ': ' + calificacion.evaluacion + '/3',
      message: calificacion.comentario,
      buttons: [this.texto.cerrar]
    });

    await alert.present();
  }
}
