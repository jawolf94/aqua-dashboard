import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicChartViewComponent } from '@app/charts/dynamic-chart-view/dynamic-chart-view.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'dynamic'},
    {path: 'dynamic', component: DynamicChartViewComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChartsRoutingModule{}
