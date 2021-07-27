import { Component, OnInit, ViewChild } from '@angular/core';
import { SignosService } from '../../../_service/signos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as moment from 'moment'; //libreria moment -> fecha
import { MatTableDataSource } from '@angular/material/table';
import { Signos } from 'src/app/_model/signos';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  id: number;
  signos: Signos;
  form: FormGroup;
  edicion: boolean = false;
  pacientes: Paciente[];
  idPacienteSeleccionado: number;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  constructor(
    private signosService: SignosService,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
  ) { }

  ngOnInit(): void {

    this.listarPacientes();

    this.signos = new Signos();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': new FormControl(''),
      'idpaciente': new FormControl(''),
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl(''),
      

    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });

  }


  initForm(){

    if (this.edicion) {
      this.signosService.listarPorId(this.id).subscribe(data => {

        console.log("XXXX");
        console.log(data);
                
        let paciente = data.paciente.nombres;
        let idpaciente = data.paciente.idPaciente;     
        let id = data.idSigno;        
        let fecha = data.fecha;
        let temperatura = data.temperatura;
        let pulso = data.pulso;
        let ritmo = data.ritmo;

        this.form = new FormGroup({

          'id': new FormControl(id),
          'paciente': new FormControl(paciente),
          'idpaciente': new FormControl(idpaciente),
          'fecha': new FormControl(fecha),
          'temperatura': new FormControl(temperatura),
          'pulso': new FormControl(pulso),
          'ritmo': new FormControl(ritmo),

        });        
        console.log(fecha);
        console.log(paciente);
        console.log(idpaciente);       
        console.log(temperatura);
        console.log(pulso);
      });
    }
  }

  limpiarControles() {
    this.idPacienteSeleccionado = 0;
    this.fechaSeleccionada = new Date();
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => this.pacientes = data);    
  }

  operar() {

    let paciente = new Paciente();
    

    // console.log("Signos");
    // console.log(this.signos);
    // if(this.signos != null){
    //   console.log("Signos algoooo");
    // }

    this.signos.idSigno =  this.form.value['id'];

    console.log("SignosXXXX");
    console.log(this.signos.idSigno);
    if (this.signos.idSigno > 0) {
      console.log("editarX");
      paciente.idPaciente = this.form.value['idpaciente'];      
    }else{      
      console.log("registrarX");
      paciente.idPaciente = this.idPacienteSeleccionado;      
    }

    this.signos.paciente = paciente;
    //this.signos.fecha = this.form.value['fecha'];
    this.signos.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DD');
    this.signos.temperatura = this.form.value['temperatura'];
    this.signos.pulso = this.form.value['pulso'];
    this.signos.ritmo = this.form.value['ritmo'];
    

    
    console.log(this.signos);

    if (this.signos != null && this.signos.idSigno > 0) {
      console.log("Editar");
      this.signosService.modificar(this.signos).pipe(switchMap(() => {
        return this.signosService.listar();
      })).subscribe(data => {
        this.signosService.setSignosCambio(data);
        this.signosService.setMensajeCambio("Se modifico");        
      });

    }else {
      console.log("registrar");
      this.signosService.registrar(this.signos).subscribe(data => {
        this.signosService.listar().subscribe(signos => {
          this.signosService.setSignosCambio(signos);
          this.signosService.setMensajeCambio("Se registró");
        });
      });

    }

    this.router.navigate(['/pages/signos']);

  }

}
