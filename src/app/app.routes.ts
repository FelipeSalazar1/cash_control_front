import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'expenses'
  },
  {
    path: 'expenses',
    loadComponent: () =>
      import('./features/expenses/expenses-page.component').then(
        (m) => m.ExpensesPageComponent
      )
  },
  {
    path: '**',
    redirectTo: 'expenses'
  }
];
