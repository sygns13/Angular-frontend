import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AppBreadcrumbService} from '../../menu/app.breadcrumb.service';

@Component({
    templateUrl: './buttondemo.component.html'
})
export class ButtonDemoComponent implements OnInit {

    items: MenuItem[];

    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'UI Kit' },
            { label: 'Button', routerLink: ['/uikit/button'] }
        ]);
    }

    ngOnInit() {
        this.items = [
            {label: 'Update', icon: 'pi pi-refresh'},
            {label: 'Delete', icon: 'pi pi-times'},
            {label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io'},
            {separator: true},
            {label: 'Setup', icon: 'pi pi-cog'}
        ];
    }
}
