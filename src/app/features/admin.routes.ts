import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path:'',
        loadComponent: () => import('./dashboard/layout/layout.component').then(m => m.LayoutComponent),
        children:[
              {
                path: 'main',
                loadComponent: () => import('./dashboard/reports/reports.component').then(m => m.ReportsComponent)
                
              },
             {
                path: 'clientes',
                loadComponent: () => import('./clients/components/client-list/client-list.component').then(m => m.ClientListComponent)
              },
              {
                path: 'ordenes',
                loadComponent: () => import('./orders/components/order-list/order-list.component').then(m => m.OrderListComponent)
              },
              {
                path: 'trabajadores',
                loadComponent: () => import('./workers/components/workers-list/workers-list.component').then(m => m.WorkersListComponent)
              },
            
             
              {
                path: 'cargos',
                loadComponent: () => import('./positions/components/positions-list/positions-list.component').then(m => m.PositionsListComponent)
              },
              {
                path: 'usuarios',
                loadComponent: () => import('./users/components/user-list/user-list.component').then(m => m.UserListComponent)
              },
              {
                path: 'usuarios/nuevo',
                loadComponent: () => import('./users/components/add-user/add-user.component').then(m => m.AddUserComponent)
              },
              {
                path: 'reportes',
                loadComponent: () => import('./reports/components/report-list/report-list.component').then(m => m.ReportListComponent)
              },                       
              {
                path:'',
                redirectTo: 'main',
                pathMatch: 'full'
              }
        ]
    }
];

