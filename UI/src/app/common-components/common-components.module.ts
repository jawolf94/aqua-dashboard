import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ChartCardLineComponent } from './chart-card-line/chart-card-line.component';

/**
 * Defined module for all common UI elements used in other views.
 */

 @NgModule({
    declarations: [
        ChartCardLineComponent
    ],
    imports: [
        CommonModule,
        MatCardModule,
        NgxChartsModule
    ],
    exports: [
        ChartCardLineComponent
    ]
 })
 export class CommonComponentsModule{}