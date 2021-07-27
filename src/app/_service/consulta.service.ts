import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
// import { Consulta } from '../_model/consulta';
// import { Examen } from '../_model/examen';
import { ConsultaListaExamenDTO } from '../_dto/consultaListaExamenDTO';
import { FiltroConsultaDTO } from '../_dto/filtroConsultaDTO';
import { Consulta } from '../_model/consulta';
import { ConsultaResumenDTO } from '../_dto/consultaResumenDTO';

// interface ConsultaListaExamenDTO{
//   consulta: Consulta,
//   lstExamen: Examen[];
// }

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private url: string = `${environment.HOST}/consultas`;

  constructor(
    private http: HttpClient
  ) { }

  registrarTransaccion(consultaDTO: ConsultaListaExamenDTO){
    return this.http.post(this.url, consultaDTO);
  }

  buscarOtros(filtroConsulta: FiltroConsultaDTO) {
    return this.http.post<Consulta[]>(`${this.url}/buscar/otros`, filtroConsulta);
  }

  buscarFecha(fecha: string) {
    return this.http.get<Consulta[]>(`${this.url}/buscar?fecha=${fecha}`);
  }

  listarExamenPorConsulta(idConsulta: number) {
    console.log(idConsulta);
    return this.http.get<ConsultaListaExamenDTO[]>(`${environment.HOST}/consultaexamenes/${idConsulta}`);
  }

  //reportes
  listarResumen() {
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  //pdf
  generarReporte(){
    return this.http.get(`${this.url}/generarReporte`
    , {
      responseType: 'blob' //para que acepte la respuesta pdf(arreglo de bytes) desde el backend
    });
  }
 
  //para guardar archivo
  guardarArchivo(data: File){ //medico: Medico  --> para enviadar data adicional de la imagen
    
    let formdata: FormData = new FormData();
    formdata.append('adjunto', data);
    //
    //const medicoBlob = new Blob([JSON.stringify(medico)], { type: "application/json" });  -->  para enviadar data adicional de la imagen
    //formdata.append('medico', medicoBlob)

    return this.http.post(`${this.url}/guardarArchivo`, formdata);
  }

  leerArchivo() {
    return this.http.get(`${this.url}/leerArchivo/1`, {//siempre duro
      responseType: 'blob'
    });
  }
  
}
