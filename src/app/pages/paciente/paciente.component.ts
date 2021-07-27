import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from '../../_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  @ViewChild(MatSort) sort : MatSort;//Para ordenar la lista
  @ViewChild(MatPaginator) paginator : MatPaginator;//Para la paginacion
  dataSource:MatTableDataSource<Paciente>;
  displayedColumns: string[] = ['idPaciente', 'nombres', 'apellidos', 'acciones'];
  cantidad: number = 0;

  constructor(
    private pacienteService:PacienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

      // this.pacienteService.listar().subscribe(//para saver la data
      //   data => {
      //     this.crearTabla(data);
      //   }
      // );

      //Paginado
      this.pacienteService.listarPageable(0, 10).subscribe(data => {
        this.cantidad = data.totalElements;

        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.sort;
      });

      console.log("entre-editar/paciente");
      //Llamada a la variable reactiva, solo reacciona con la variable next del service
      //son asincronos
      this.pacienteService.getPacienteCambio().subscribe(
        data => {
          this.crearTabla(data);
      });

      //para el mensaje... de aviso
      this.pacienteService.getMensajeCambio().subscribe(data => {
        this.snackBar.open(data, 'AVISO', {
          duration: 2000,
          verticalPosition: "top",
          horizontalPosition: "right"
        });
      });

  }

  filtrar(valor:string){//para buscar, filtro
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(id: number) {
    this.pacienteService.eliminar(id).subscribe(() => { //Elimina el registro
      this.pacienteService.listar().subscribe(data => {
        //this.crearTabla(data); //forma 1
        this.pacienteService.setPacientecambio(data);//forma 2
        this.pacienteService.setMensajeCambio('SE ELIMINO');
      });
    });
  }

  //metodo para ordenar
  crearTabla(data: Paciente[]) {
    console.log(data);
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;//Para ordenar la lista
          this.dataSource.paginator = this.paginator;//para la paginacion
  }

  mostrarMas(e: any){
    this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

}
