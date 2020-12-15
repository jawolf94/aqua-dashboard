import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'reading'},
  {path: 'reading', loadChildren: () => import('@app/reading/reading.module').then(m => m.ReadingModule)},
  {path: 'charts', loadChildren: () => import('@app/charts/charts.module').then(m => m.ChartsModule)},
  {path: 'cleaning', loadChildren: () => import('@app/cleaning/cleaning.module').then(m => m.CleaningModule)},
  {path: '**', redirectTo: 'reading'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
