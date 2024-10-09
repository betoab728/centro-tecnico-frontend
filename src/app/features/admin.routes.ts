import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path:'',
        loadComponent: () => import('./dashboard/layout/layout.component').then(m => m.LayoutComponent),
        children:[
              { path: 'main',loadComponent: () => import('./dashboard/reports/reports.component').then(m => m.ReportsComponent)},
              { path: 'clientes', loadComponent: () => import('./clients/components/client-list/client-list.component').then(m => m.ClientListComponent)},
              { path: 'clientes/nuevo',loadComponent: () => import('./clients/components/add-client/add-client.component').then(m => m.AddClientComponent)},
              { path: 'clientes/editar/:id',loadComponent: () => import('./clients/components/edit-client/edit-client.component').then(m => m.EditClientComponent) },
              { path: 'ordenes', loadComponent: () => import('./orders/components/order-list/order-list.component').then(m => m.OrderListComponent)},
              {path: 'ordenes/nuevo',loadComponent: () => import('./orders/components/add-order/add-order.component').then(m => m.AddOrderComponent)},
              { path: 'trabajadores',loadComponent: () => import('./workers/components/workers-list/workers-list.component').then(m => m.WorkersListComponent)  },
              { path: 'trabajadores/nuevo',loadComponent: () => import('./workers/components/add-worker/add-worker.component').then(m => m.AddWorkerComponent) },
              { path: 'trabajadores/editar/:id',loadComponent: () => import('./workers/components/edit-worker/edit-worker.component').then(m => m.EditWorkerComponent) },
              { path: 'cargos',loadComponent: () => import('./positions/components/positions-list/positions-list.component').then(m => m.PositionsListComponent)   },
              { path: 'cargos/editar/:id',loadComponent: () => import('./positions/components/edit-position/edit-position.component').then(m => m.EditPositionComponent) },  
              { path: 'cargos/nuevo',loadComponent: () => import('./positions/components/add-position/add-position.component').then(m => m.AddPositionComponent) },
              { path: 'usuarios',loadComponent: () => import('./users/components/user-list/user-list.component').then(m => m.UserListComponent)   },
              { path: 'usuarios/nuevo',loadComponent: () => import('./users/components/add-user/add-user.component').then(m => m.AddUserComponent)   },
              { path: 'usuarios/editar/:id',loadComponent: () => import('./users/components/edit-user/edit-user.component').then(m => m.EditUserComponent) },
              { path: 'reportes',loadComponent: () => import('./reports/components/report-list/report-list.component').then(m => m.ReportListComponent)},                       
              {
                path:'',
                redirectTo: 'main',
                pathMatch: 'full'
              }
        ]
    }
];

