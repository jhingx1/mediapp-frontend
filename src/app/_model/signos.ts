import { Paciente } from "./paciente";

export class Signos {
    idSigno: number;
    paciente: Paciente;
    fecha: string; //ISO Date
    temperatura: string;
    pulso: string;
    ritmo: string;
}