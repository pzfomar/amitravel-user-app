import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { format, parseISO } from 'date-fns';
import { lang } from './agenda.lang';
import { obtenerAgendaLoading, ObtenerAgendaResponse } from './store/obtenerAgenda.store';
import { AppState } from './store/store';
import { Storage } from '@capacitor/storage';
import { crearAgendaLoading, CrearAgendaRequest } from './store/crearAgenda.store';
import { actualizarAgendaLoading, ActualizarAgendaRequest } from './store/actualizarAgenda.store';
import { eliminarAgendaLoading } from './store/eliminarAgenda.store';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  texto = lang.es;
  date: Date = new Date();
  dateText: string = format(new Date(), 'MMM dd yyyy');
  obtenerAgenda: ObtenerAgendaResponse[];
  usuarioId: number;

  constructor(private store: Store<AppState>, public alertController: AlertController) { }

  async ngOnInit() {
    this.store.select('obtenerAgenda').subscribe(s => {
      if (s.response) {
        this.obtenerAgenda = s.response;
      }
    });
    
    this.store.select('crearAgenda').subscribe(s => {
      if (s.response && this.usuarioId) {
        this.store.dispatch(obtenerAgendaLoading({ lang: 'es', usuarioId: this.usuarioId, fecha: this.date }));
      }
    });

    this.store.select('actualizarAgenda').subscribe(s => {
      if (s.response && this.usuarioId) {
        this.store.dispatch(obtenerAgendaLoading({ lang: 'es', usuarioId: this.usuarioId, fecha: this.date }));
      }
    });

    this.store.select('eliminarAgenda').subscribe(s => {
      if (s.response && this.usuarioId) {
        this.store.dispatch(obtenerAgendaLoading({ lang: 'es', usuarioId: this.usuarioId, fecha: this.date }));
      }
    });
    
    let usuarioId = await Storage.get({ key: 'usuarioId' });
    if (usuarioId.value) {
      this.usuarioId = Number(usuarioId.value);
      this.store.dispatch(obtenerAgendaLoading({ lang: 'es', usuarioId: this.usuarioId, fecha: this.date }));
    }
  }

  async selectDate(value) {
    this.date = parseISO(value);
    this.dateText = format(parseISO(value), 'MMM dd yyyy');

    if (this.usuarioId) {
      this.store.dispatch(obtenerAgendaLoading({ lang: 'es', usuarioId: this.usuarioId, fecha: this.date }));
    }
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
          placeholder: this.texto.titulo
        },
        {
          name: 'descripcion',
          id: 'descripcion',
          type: 'textarea',
          placeholder: this.texto.descripcion
        },
        {
          name: 'fecha',
          id: 'fecha',
          type: 'datetime-local',
          value: format(this.date, 'yyyy-MM-dd') + 'T' + format(this.date, 'HH:mm')
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
            this.store.dispatch(crearAgendaLoading({ lang: 'es', request: request }));
          }
        }
      ]
    });
    await alert.present();
  }

  async editarAgenda(agenda: ObtenerAgendaResponse) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.texto.agendar,
      inputs: [
        {
          name: 'titulo',
          id: 'titulo',
          type: 'text',
          placeholder: this.texto.titulo,
          value: agenda.nombre
        },
        {
          name: 'descripcion',
          id: 'descripcion',
          type: 'textarea',
          placeholder: this.texto.descripcion,
          value: agenda.descripcion
        },
        {
          name: 'fecha',
          id: 'fecha',
          type: 'datetime-local',
          value: agenda.fecha + 'T' + agenda.hora
        }
      ],
      buttons: [
        {
          text: this.texto.cancelar,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: this.texto.actualizar,
          handler: (value) => {
            if (!this.usuarioId || !value.titulo || !value.descripcion || !value.fecha) {
              return false;
            }
            
            let request = new ActualizarAgendaRequest();
            request.nombre = value.titulo;
            request.descripcion = value.descripcion;
            request.fecha = format(parseISO(value.fecha), 'yyyy-MM-dd');
            request.hora = format(parseISO(value.fecha), 'HH:mm:ss');
            request.usuarioId = this.usuarioId;
            request.eventoId = agenda.eventoId;
            request.id = agenda.id;
            this.store.dispatch(actualizarAgendaLoading({ lang: 'es', id: agenda.id, request: request }));
          }
        },
        {
          text: this.texto.eliminar,
          handler: (value) => {
            if (!this.usuarioId || !value.titulo || !value.descripcion || !value.fecha) {
              return false;
            }
            this.store.dispatch(eliminarAgendaLoading({ lang: 'es', id: agenda.id }));
          }
        }        
      ]
    });
    await alert.present();
  }
}
