import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/components/login/login.component';

export const routes: Routes = [

    // Ruta para el login
    {
        path: 'login',component:LoginComponent
    },

    {
        path:'',
        redirectTo: 'login',
        pathMatch: 'full'
    },
     // Ruta para el dashboard con lazy loading para el layout y sus hijos
     {
        path: 'admin',
        loadChildren: () => import('./features/admin.routes').then(m => m.adminRoutes),
     },
    {
        path:'',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path:'**',
        redirectTo: 'login',
        pathMatch: 'full'
    }


];


