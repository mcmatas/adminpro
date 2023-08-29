import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { authGuard, canMatch } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';


const routes: Routes = [
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ authGuard ],
        // La logica del lazyload se hace de esta manera:
        canMatch: [ canMatch ],
        loadChildren: () => import('./child-routes.module').then( module => module.ChildRoutesModule )
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


