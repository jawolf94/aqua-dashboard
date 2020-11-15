import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo: 'reading'},
  {path: 'reading', loadChildren: () => import('./reading/reading.module').then(m => m.ReadingModule)},
  {path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
