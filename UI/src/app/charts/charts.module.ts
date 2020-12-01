import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';

import { ChartsRoutingModule } from '@app/charts/charts.routing';
import { DynamicChartViewComponent } from '@app/charts/dynamic-chart-view/dynamic-chart-view.component';
import { CommonComponentsModule } from '@app/common-components/common-components.module';
import { ReadingApiService } from '@app/services/reading-api.service';

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
    ],
    providers: [
        ReadingApiService
    ]
})
export class ChartsModule{}