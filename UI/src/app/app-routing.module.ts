import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo: 'reading'},
  {path: 'reading', loadChildren: () => import('./reading/reading.module').then(m => m.ReadingModule)}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
