import {Component, OnInit} from '@angular/core';
import { IconService } from '../demo/service/iconservice';
import {AppBreadcrumbService} from '../menu/app.breadcrumb.service';

@Component({
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.scss']
})
export class IconsComponent implements OnInit {

    icons: any [];

    filteredIcons: any [];

    selectedIcon: any;

    constructor(private iconService: IconService, private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Utilities' },
            { label: 'Icons', routerLink: ['/utilities/icons'] }
        ]);
    }

    ngOnInit() {
        this.iconService.getIcons().subscribe(data => {
            const icons = data;
            icons.sort((icon1, icon2) => {
                if (icon1.properties.name < icon2.properties.name) {
                    return -1;
                }
                else if (icon1.properties.name < icon2.properties.name) {
                    return 1;
 }
                else {
                    return 0;
 }
            });

            this.icons = icons;
            this.filteredIcons = data;
        });
    }

    onFilter(event: KeyboardEvent): void {
        const searchText = (event.target as HTMLInputElement).value;

        if (!searchText) {
            this.filteredIcons = this.icons;
        }
        else {
            this.filteredIcons = this.icons.filter( it => {
                return it.icon.tags[0].includes(searchText);
            });
        }
    }
}
