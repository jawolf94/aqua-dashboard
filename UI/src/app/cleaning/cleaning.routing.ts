import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCleaningComponent } from './add-cleaning/add-cleaning.component';

const routes:Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'add-cleaning'},
    {path: 'add-cleaning', component: AddCleaningComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class CleaningRoutingModule{}