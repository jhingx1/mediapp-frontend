import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from '../../../_service/paciente.service';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean; //para saver si voy a editar

  constructor(
    private router: Router,//para navegar
    private route: ActivatedRoute, //saber donde me encuetrao-ruta activa
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    console.log("paciente-edicion");
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl(''),
      'email': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {//recupera el id de la ruta que esta pasando en el router link para ediocion/:id
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
      console.log(data);
    })

  }

  initForm() {//poblar el formulario
    if (this.edicion) {
      this.pacienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'dni': new FormControl(data.dni),
          'telefono': new FormControl(data.telefono),
          'direccion': new FormControl(data.direccion),
          'email': new FormControl(data.email)
        });
      });
    }
  }
  
  operar(): void {

    let paciente = new Paciente();//variable de apoyo
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];
    paciente.email = this.form.value['email'];

    console.log("entre-editar");
    if (this.edicion) {
      //MODIFICAR
      this.pacienteService.modificar(paciente).subscribe(()=> {
        this.pacienteService.listar().subscribe(data => {
          // this.pacienteService.pacienteCambio.next(data);
          // this.pacienteService.mensajeCambio.next('SE MODIFICO');

          this.pacienteService.setPacientecambio(data);
          this.pacienteService.setMensajeCambio('SE MODIFICO');

        });
      });
      
    } else {
      //REGISTRAR
      this.pacienteService.registrar(paciente).subscribe(()=> {
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.setPacientecambio(data);
          this.pacienteService.setMensajeCambio('SE REGISTRO');
        });
      });

    }
    this.router.navigate(['paciente']);
  }


}
