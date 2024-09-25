import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path:'',
        loadComponent: () => import('./dashboard/layout/layout.component').then(m => m.LayoutComponent),
        children:[
            {
                path: 'usuarios',
                loadComponent: () => import('./users/components/user-list/user-list.component').then(m => m.UserListComponent)
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
                path: 'clientes',
                loadComponent: () => import('./clients/components/client-list/client-list.component').then(m => m.ClientListComponent)
              },
              {
                path: 'ordenes',
                loadComponent: () => import('./orders/components/order-list/order-list.component').then(m => m.OrderListComponent)
              },
              {
                path: 'reportes',
                loadComponent: () => import('./reports/components/report-list/report-list.component').then(m => m.ReportListComponent)
              },
              {
                path:'',
                redirectTo: 'usuarios',
                pathMatch: 'full'
              }
        ]
    }
];

