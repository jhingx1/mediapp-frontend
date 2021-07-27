import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { Medico } from 'src/app/_model/medico';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { Especialidad } from 'src/app/_model/especialidad';
import { ExamenService } from 'src/app/_service/examen.service';
import { Examen } from 'src/app/_model/examen';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment'; //libreria moment -> fecha
import { ConsultaListaExamenDTO } from 'src/app/_dto/consultaListaExamenDTO';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { Consulta } from 'src/app/_model/consulta';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes: Paciente[];//forma-1
  pacientes$: Observable<Paciente[]>;//forma-2, Observable: es un flujo de datos de tipo paciente
  medicos$: Observable<Medico[]>;
  especialidades$: Observable<Especialidad[]>;
  examenes$: Observable<Examen[]>

  idPacienteSeleccionado: number;
  idMedicoSeleccionado: number;
  idEspecialidadSeleccionado: number;
  idExamenSeleccionado: number;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  diagnostico: string;
  tratamiento: string;

  detalleConsulta: DetalleConsulta[] = [];//inicializar la lista
  examenesSeleccionados: Examen[] = [];

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar
    
  ) { }

  ngOnInit(): void {
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();
  }

  agregar() {
    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;

      this.detalleConsulta.push(det);

      this.diagnostico = null;
      this.tratamiento = null;
    }
  }

  agregarExamen() {
    if (this.idExamenSeleccionado > 0) {

      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El examen se encuentra en la lista';
        this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
      } else {
        //preguntar al Backend
        this.examenService.listarPorId(this.idExamenSeleccionado).
        subscribe(data => {
          this.examenesSeleccionados.push(data);
        });

      }
    }
  }

  aceptar() {
    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;
    console.log(medico);

    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionado;

    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let consulta = new Consulta();
    consulta.medico = medico;
    consulta.paciente = paciente;
    consulta.especialidad = especialidad;
    consulta.numConsultorio = "C1";
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;
    //ISODate
    /*let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(this.fechaSeleccionada.getTime() - tzoffset)).toISOString();
    console.log(localISOTime);
    consulta.fecha = localISOTime*/

    let dto = new ConsultaListaExamenDTO();
    dto.consulta = consulta;
    dto.lstExamen = this.examenesSeleccionados; //deber ser el mismo que el backend : lstExamen

    this.consultaService.registrarTransaccion(dto).subscribe(() => {
      this.snackBar.open("SE REGISTRO", 'AVISO', { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000)
    });
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = null;
    this.tratamiento = null;
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionado = 0;
    this.idMedicoSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
  }

  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.idEspecialidadSeleccionado === 0 || this.idMedicoSeleccionado === 0 || this.idPacienteSeleccionado === 0);
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);//borra desde el elemento hasta el que se indica
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }
  
  listarPacientes() {
    //this.pacienteService.listar().subscribe(data => this.pacientes = data);
    this.pacientes$ = this.pacienteService.listar();
  }

  listarMedicos() {
    this.medicos$ = this.medicoService.listar();
  }

  listarEspecialidad() {
    this.especialidades$ = this.especialidadService.listar();
  }

  listarExamenes() {
    this.examenes$ = this.examenService.listar();
  }

}
