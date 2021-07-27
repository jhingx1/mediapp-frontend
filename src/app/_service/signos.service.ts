import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Signos } from '../_model/signos';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosService extends GenericService<Signos>{

  private signosCambio = new Subject<Signos[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/signos`);
  }

  //get Subjects
  getSignoCambio() {
    return this.signosCambio.asObservable();
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  //set Subjects
  setSignosCambio(signos: Signos[]) {
    this.signosCambio.next(signos);
  }
  
  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

}
