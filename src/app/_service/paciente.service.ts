import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Paciente } from 'src/app/_model/paciente';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente>{

  //Variable reactiva
  private pacienteCambio: Subject<Paciente[]> = new Subject<Paciente[]>();  
  private mensajeCambio: Subject<string> = new Subject<string>();

  // private url: string = `${environment.HOST}/pacientes`;  //ES6  Template Strings ``
  // constructor(private http:HttpClient) { }

  constructor(protected http: HttpClient) {
    super(//invoca al contructor padre
      http,
      `${environment.HOST}/pacientes`);
  }

  listarPageable(p: number, s:number){//,sort?:string  --> mandar otros parametros
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  // listar(){//ES6 template string 
  //   return this.http.get<Paciente[]>(this.url); //ES6  Template Strings ``
  // }

  // listarPorId(id: number) {//ES6 template string 
  //   return this.http.get<Paciente>(`${this.url}/${id}`); //ES6  Template Strings ``
  // }

  // registrar(paciente: Paciente) {
  //   return this.http.post(this.url, paciente);
  // }

  // modificar(paciente: Paciente) {
  //   return this.http.put(this.url, paciente);
  // }

  // eliminar(id: number) {
  //   return this.http.delete(`${this.url}/${id}`);
  // }

  //para colocar como privado a las variables: mensajeCambio y pacienteCambio
  //////////////////////////
  getPacienteCambio() {
    return this.pacienteCambio.asObservable();
  }

  setPacientecambio(lista: Paciente[]) {
    this.pacienteCambio.next(lista);
  }

  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }



}
