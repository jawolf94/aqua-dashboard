import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';

import { CommonComponentsModule } from '../common-components/common-components.module';
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
        CommonComponentsModule,
        CommonModule,
        ChartsRoutingModule,
        MatCardModule,
        MatCheckboxModule,
        MatGridListModule,
    ]
})
export class ChartsModule{}