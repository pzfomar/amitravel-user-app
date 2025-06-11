import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { crearPersonaLoading, CrearPersonaRequest } from './store/crearPersona.store';
import { crearUsuarioLoading, CrearUsuarioRequest } from './store/crearUsuario.store';
import { obtenerPersonaLoading } from './store/obtenerPersona.store';
import { AppState } from './store/store';
import { lang } from './usuario.lang';
import { Storage } from '@capacitor/storage';
import { obtenerUsuarioLoading } from './store/obtenerUsuario.store';
import { authoUsuarioLoading, AuthoUsuarioRequest } from './store/authoUsuario.store';
import { obtenerAficionLoading, ObtenerAficionResponse } from './store/obtenerAficion.store';
import { format, parseISO } from 'date-fns';
import { crearAficionLoading, CrearAficionRequest } from './store/crearAficion.store';
import { recuperaUsuarioLoading } from './store/recuperaUsuario.store';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  texto = lang.es;
  iniciarSesionForm: FormGroup;
  registrarseForm: FormGroup;
  activarRegistro: boolean = false;
  sesionIniciada: boolean = false;
  crearUsuario: CrearUsuarioRequest;
  crearPersona: CrearPersonaRequest;
  usuario: any;
  persona: any;
  aficiones: ObtenerAficionResponse[];
  personaUbicacion: string;

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder, private alertController: AlertController) { }

  async ngOnInit() {
    this.store.select('crearUsuario').subscribe(s => {
      if (s.response) {
        this.usuario = s.response;
        this.crearPersona.usuarioId = s.response.id;
        this.store.dispatch(crearPersonaLoading({ lang: 'es', request: this.crearPersona }));
      }
      if (s.error) {
        this.alertaError('Alerta', 'El apodo ya está en uso');
      }
    });

    this.store.select('crearPersona').subscribe(async s => {
      if (s.response) {
        this.persona = s.response;
        this.limpiarRegistro();
        this.sesionIniciada = true;
        await Storage.set({ key: 'usuarioId', value: s.response.usuarioId });
      }
    });

    this.store.select('authoUsuario').subscribe(async s => {
      if (s.response) {
        this.sesionIniciada = true;
        await Storage.set({ key: 'usuarioId', value: s.response.id.toString() });
        this.store.dispatch(obtenerUsuarioLoading({ lang: 'es', id: s.response.id }));
        window.location.reload();
      }
      if (s.error) {
        this.alertaError('Alerta', 'Credenciales erróneas');
      }
    });

    this.store.select('obtenerUsuario').subscribe(s => {
      if (s.response) {
        this.usuario = s.response;
        this.store.dispatch(obtenerPersonaLoading({ lang: 'es', usuarioId: s.response.id }));
        this.store.dispatch(obtenerAficionLoading({ lang: 'es', usuarioId: s.response.id }));
      }
    });

    this.store.select('obtenerPersona').subscribe(s => {
      if (s.response) {
        this.persona = s.response;
        this.activarRegistro = false;
        this.sesionIniciada = true;
      }
    });

    this.store.select('obtenerAficion').subscribe(s => {
      if (s.response) {
        this.aficiones = s.response;
      }
    });

    this.store.select('crearAficion').subscribe(s => {
      if (s.response) {
        this.store.dispatch(obtenerAficionLoading({ lang: 'es', usuarioId: s.response.usuarioId }));
      }
    });

    this.iniciarSesionForm = this.formBuilder.group({
      apodo: ['', [Validators.required, Validators.minLength(1)]],
      contrasenia: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.registrarseForm = this.formBuilder.group({
      apodo: ['', [Validators.required, Validators.minLength(1)]],
      contrasenia: ['', [Validators.required, Validators.minLength(1)]],
      confirmarContrasenia: ['', [Validators.required, Validators.minLength(1)]],
      correo: ['', [Validators.required, Validators.minLength(1)]],
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(1)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(1)]],
      edad: ['', [Validators.required, Validators.minLength(1), Validators.min(15), Validators.max(100)]],
      telefono: ['', [Validators.required, Validators.minLength(1)]]
    });

    let usuarioId = await Storage.get({ key: 'usuarioId' });
    if (usuarioId.value) {
      this.store.dispatch(obtenerUsuarioLoading({ lang: 'es', id: Number(usuarioId.value) }));
      this.store.dispatch(obtenerAficionLoading({ lang: 'es', usuarioId: Number(usuarioId.value) }));
    }
  }

  registrarse() {
    this.crearUsuario = new CrearUsuarioRequest();
    this.crearUsuario.apodo = this.registrarseForm.value.apodo;
    this.crearUsuario.contrasenia = this.registrarseForm.value.contrasenia;

    this.crearPersona = new CrearPersonaRequest();
    this.crearPersona.correo = this.registrarseForm.value.correo;
    this.crearPersona.nombre = this.registrarseForm.value.nombre;
    this.crearPersona.apellidoPaterno = this.registrarseForm.value.apellidoPaterno;
    this.crearPersona.apellidoMaterno = this.registrarseForm.value.apellidoMaterno;
    this.crearPersona.edad = this.registrarseForm.value.edad;
    this.crearPersona.telefono = this.registrarseForm.value.telefono;

    this.store.dispatch(crearUsuarioLoading({ lang: 'es', request: this.crearUsuario }));
  }

  validarRegistro() {
    if (this.registrarseForm.value.contrasenia != this.registrarseForm.value.confirmarContrasenia) {
      return true;
    }
    if (!this.registrarseForm.valid) {
      return true;
    }
  }

  iniciarSesion() {
    let autho = new AuthoUsuarioRequest();
    autho.apodo = this.iniciarSesionForm.value.apodo;
    autho.contrasenia = this.iniciarSesionForm.value.contrasenia;
    this.store.dispatch(authoUsuarioLoading({ lang: 'es', request: autho }));
  }

  limpiarSesion() {
    this.iniciarSesionForm.reset();
  }

  limpiarRegistro() {
    this.crearUsuario = new CrearUsuarioRequest();
    this.crearPersona = new CrearPersonaRequest();
    this.registrarseForm.reset();
    this.activarRegistro = false;    
  }

  async aficionDiaria() {
    let request = new CrearAficionRequest();
    request.usuarioId = this.usuario.id;

    const presupuesto = await this.alertController.create({
      header: this.texto.presupuesto,
      inputs: [
        { placeholder: this.texto.dineroMxn, type: 'number', min: 1, max: 10000 }
      ],
      buttons: [
        { text: this.texto.cancelar, role: 'cancel', cssClass: 'danger' },
        { text: this.texto.confirmar, handler: (value) => {
          if (!value || !value[0]) {
            return false;
          }
          request.presupuesto = value[0];
          this.store.dispatch(crearAficionLoading({ lang: 'es', request: request }));
        } }
      ]
    });

    const horarioActividad = await this.alertController.create({
      header: this.texto.horarioActividad,
      inputs: [
        { label: this.texto.dia, type: 'radio', value: 'DIA' },
        { label: this.texto.tarde, type: 'radio', value: 'TARDE' },
        { label: this.texto.noche, type: 'radio', value: 'NOCHE' }
      ],
      buttons: [
        { text: this.texto.cancelar, role: 'cancel', cssClass: 'danger' },
        { text: this.texto.confirmar,handler: (value) => {
          if (!value) {
            return false;
          }
          request.horarioActividad = value;
          presupuesto.present();
        } }
      ]
    });

    const sitio = await this.alertController.create({
      header: this.texto.sitio,
      inputs: [
        { label: this.texto.cerrado, type: 'radio', value: 'CERRADO' },
        { label: this.texto.abierto, type: 'radio', value: 'ABIERTO' }
      ],
      buttons: [
        { text: this.texto.cancelar, role: 'cancel', cssClass: 'danger' },
        { text: this.texto.confirmar, handler: (value) => {
          if (!value) {
            return false;
          }
          request.sitio = value;
          horarioActividad.present();
        } }
      ]
    });

    const movilidad = await this.alertController.create({
      header: this.texto.movilidad,
      inputs: [
        { label: this.texto.carro, type: 'radio', value: 'CARRO' },
        { label: this.texto.pie, type: 'radio', value: 'PIE' }
      ],
      buttons: [
        { text: this.texto.cancelar, role: 'cancel', cssClass: 'danger' },
        { text: this.texto.confirmar, handler: (value) => {
          if (!value) {
            return false;
          }
          request.movilidad = value;
          sitio.present();
        } }
      ]
    });

    await movilidad.present();
  }

  ubicacion() {
  }

  async cerrarSesion() {
    this.sesionIniciada = false;
    this.limpiarSesion();
    this.limpiarRegistro();
    await Storage.remove({ key: 'usuarioId' });
    window.location.reload();
  }

  formatoFecha(fecha: Date) {
    return format(parseISO(fecha.toString()), 'MMM dd yyyy');
  }

  async recuperarCuenta() {
    const recuperar = await this.alertController.create({
      header: this.texto.movilidad,
      inputs: [
        { placeholder: this.texto.apodo, type: 'text' }
      ],
      buttons: [
        { text: this.texto.cancelar, role: 'cancel', cssClass: 'danger' },
        { text: this.texto.confirmar, handler: (value) => {
          if (!value[0]) {
            return false;
          }
          this.store.dispatch(recuperaUsuarioLoading({ lang: 'es', apodo: value[0] }));
        } }
      ]
    });

    await recuperar.present();
  }
  
  async alertaError(titulo: string, mensage: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensage,
      buttons: ['Cerrar']
    });
    await alert.present();
  }
}
