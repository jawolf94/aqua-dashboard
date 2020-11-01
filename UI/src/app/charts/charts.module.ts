import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'
import { ChartsRoutingModule } from './charts.routing';

import { DynamicChartViewComponent } from './dynamic-chart-view/dynamic-chart-view.component';

/**
 * Module which defines additional views for data visualization
 */
@NgModule({
    declarations: [
        DynamicChartViewComponent
    ],
    imports:[
        CommonModule,
        ChartsRoutingModule
    ]
})
export class ChartsModule{}