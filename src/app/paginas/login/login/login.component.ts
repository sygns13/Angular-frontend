import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginService } from 'src/app/_service/login.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;

  content1: string = '';
  content2: string = '';

  verMensaje: boolean = false;
  verError: boolean = false;

  constructor(private loginService: LoginService,
    private router: Router,) { }

  ngOnInit(): void {
  }

  iniciarSesion() {
    this.loginService.login(this.usuario, this.clave).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);

      console.log(data);
      this.router.navigate(['/principal']);
      console.log( this.router.navigate(['/principal']) );
      console.log("no rutea");
    });
  }

  /* ngAfterViewInit() {
    (window as any).initialize();
  } */

}
