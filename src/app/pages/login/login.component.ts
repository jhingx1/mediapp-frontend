import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import '../../../assets/login-animation.js';
import { LoginService } from '../../_service/login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;

  constructor(    
    private loginService : LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  iniciarSesion(){
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      //console.log(data);
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);

      this.router.navigate(['pages/inicio']);
    });
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

}