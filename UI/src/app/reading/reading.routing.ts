import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ReadingDashboardComponent} from '@app/reading/reading-dashboard/reading-dashboard.component';
import {ReadingFormComponent} from '@app/reading/reading-form/reading-form.component';

const routes: Routes = [
    {path: '', component: ReadingDashboardComponent},
    {path: 'add-reading', component: ReadingFormComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReadingRoutingModule{}
