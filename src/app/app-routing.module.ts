import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Fondo Principal padre
import {AppMainComponent} from './menu/app.main.component';

//tablas base
import {LocalComponent} from './paginas/tablas/local/local.component';
import {TipoProductoComponent} from './paginas/tablas/tipoproducto/tipoproducto.component';

import {DashboardComponent} from './demo/view/dashboard.component';
import {DashboardAnalyticsComponent} from './demo/view/dashboardanalytics.component';
import {FormLayoutDemoComponent} from './demo/view/formlayoutdemo.component';
import {InvalidStateDemoComponent} from './demo/view/invalidstatedemo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MediaDemoComponent} from './demo/view/mediademo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';

import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppContactusComponent} from './pages/app.contactus.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
import {AppLoginComponent} from './pages/app.login.component';
import {AppLandingComponent} from './pages/app.landing.component';
import {InputDemoComponent} from './demo/view/inputdemo.component';
import {FloatLabelDemoComponent} from './demo/view/floatlabeldemo.component';
import {ButtonDemoComponent} from './demo/view/buttondemo.component';
import {TableDemoComponent} from './demo/view/tabledemo.component';
import {ListDemoComponent} from './demo/view/listdemo.component';
import {AppTimelineDemoComponent} from './pages/app.timelinedemo.component';
import {TreeDemoComponent} from './demo/view/treedemo.component';
import {DisplayComponent} from './utilities/display.component';
import {ElevationComponent} from './utilities/elevation.component';
import {FlexboxComponent} from './utilities/flexbox.component';
import {GridComponent} from './utilities/grid.component';
import {IconsComponent} from './utilities/icons.component';
import {WidgetsComponent} from './utilities/widgets.component';
import {SpacingComponent} from './utilities/spacing.component';
import {TypographyComponent} from './utilities/typography.component';
import {TextComponent} from './utilities/text.component';
import {AppCrudComponent} from './pages/app.crud.component';
import {AppCalendarComponent} from './pages/app.calendar.component';
import {AppInvoiceComponent} from './pages/app.invoice.component';
import {AppHelpComponent} from './pages/app.help.component';


const routes: Routes = [

  {
    path: '', component: AppMainComponent,
    children: [
     /* {path: '', component: DashboardComponent}, */
    ]
  },
  {
    path: 'principal', component: AppMainComponent,
    children: [
     /* {path: 'principal', component: DashboardComponent}, */
    ]
  },
  {
    path: 'tablas', component: AppMainComponent,
    children: [
     {path: 'locales', component: LocalComponent},
     {path: 'tipo_productos', component: TipoProductoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
