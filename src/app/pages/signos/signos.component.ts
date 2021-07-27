import { Component, OnInit, ViewChild } from '@angular/core';
import { Signos } from '../../_model/signos';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SignosService } from '../../_service/signos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Paciente } from '../../_model/paciente';
import { PacienteService } from '../../_service/paciente.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  displayedColumns = ['id','paciente', 'fecha','temperatura','pulso','ritmo', 'acciones'];
  dataSource: MatTableDataSource<Signos>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pacientes: Paciente[];

  constructor(
    private signosService: SignosService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {

    this.signosService.getSignoCambio().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator; 
      }
    );

    this.signosService.getMensajeCambio().subscribe(
      data => {
        this.snackBar.open(data, 'Aviso', {
          duration: 2000,
        });
      }
    );

    this.signosService.listar().subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    //this.listarPacientes();

  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      console.log(data);
      this.pacientes = data;
    });
  }

  eliminar(signos: Signos) {
    this.signosService.eliminar(signos.idSigno).pipe(switchMap(() => {
      return this.signosService.listar();
    })).subscribe(data => {
      this.signosService.setSignosCambio(data);
      this.signosService.setMensajeCambio('Se eliminó');
    });
  }

}
