import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCleaningComponent } from './add-cleaning/add-cleaning.component';
import { CleaningViewComponent } from './cleaning-view/cleaning-view.component';

const routes:Routes = [
    {path: '', component: CleaningViewComponent},
    {path: 'add-cleaning', component: AddCleaningComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CleaningRoutingModule{}