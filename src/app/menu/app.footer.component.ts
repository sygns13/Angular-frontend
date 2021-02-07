import {Component} from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer p-d-flex p-ai-center p-p-4 p-shadow-2">
            <img id="footer-logo" [src]="'assets/layout/images/footer-' + (app.layoutMode === 'light' ? 'ultima' : 'ultima-dark') + '.svg'" alt="ultima-footer-logo">
            <button pButton pRipple type="button" icon="pi pi-github fs-large" class="p-button-rounded p-button-text p-button-plain" [ngClass]="{'p-ml-auto p-mr-2': !app.isRTL, 'p-ml-2 p-mr-auto': app.isRTL}"></button>
            <button pButton pRipple type="button" icon="pi pi-facebook fs-large" class="p-button-rounded p-button-text p-button-plain" [ngClass]="{'p-mr-2': !app.isRTL, 'p-ml-2': app.isRTL}"></button>
            <button pButton pRipple type="button" icon="pi pi-twitter fs-large" class="p-button-rounded p-button-text p-button-plain" [ngClass]="{'p-mr-2': !app.isRTL, 'p-ml-2': app.isRTL}"></button>
        </div>
    `
})
export class AppFooterComponent {
    constructor(public app: AppComponent) {}
}
