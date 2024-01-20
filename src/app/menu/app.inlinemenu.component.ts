import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { AppMainComponent } from './app.main.component';
import { AppComponent } from '../app.component';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { LoginService } from '../_service/login.service';

@Component({
    selector: 'app-inline-menu',
    templateUrl: './app.inlinemenu.component.html',
    animations: [
        trigger('menu', [
            state('hiddenAnimated', style({
                height: '0px',
                paddingBottom: '0px',
                overflow: 'hidden'
            })),
            state('visibleAnimated', style({
                height: '*',
                overflow: 'visible'
            })),
            state('visible', style({
                opacity: 1,
                display:'block',
                'z-index': 100
            })),
            state('hidden', style({
                opacity: 0,
                display: 'none',
                'z-index': '*'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('visible => hidden', animate('.1s linear')),
            transition('hidden => visible', [style({transform: 'scaleY(0.8)'}), animate('.12s cubic-bezier(0, 0, 0.2, 1)')])
        ])
    ]
})
export class AppInlineMenuComponent {

    @Input() key = "inline-menu";

    @Input() style: any;

    @Input() styleClass: string;

    active: boolean;

    usuario: string = '';

    tipo_usuario: string = '';

    constructor(public appMain: AppMainComponent, public app: AppComponent,
                private loginService: LoginService) { }

    ngOnInit(): void {

        const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;
    this.tipo_usuario = decodedToken.authorities[0];

    /*
    this.menuService.listarPorUsuario(this.usuario).subscribe(data => {
      this.menuService.setMenuCambio(data);
    });*/

    }

    onClick(event) {
        this.appMain.onInlineMenuClick(event, this.key);
        event.preventDefault();
    }

    get isTooltipDisabled() {
        return !(this.appMain.isSlim() && !this.appMain.isMobile());
    }

    get tabIndex() {
        return !this.appMain.inlineMenuActive  ? '-1' : null;
    }

    isHorizontalActive() {
       return this.appMain.isHorizontal() && !this.appMain.isMobile();
    }


    cerrarSesion(event){
        this.loginService.cerrarSesion();
    }
}
