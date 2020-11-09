import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';

import { ChartsModule } from 'ng2-charts';

import { ChartCardLineComponent } from './chart-card-line/chart-card-line.component';
import { DateTimePickerComponent } from './datetime-picker/datetime-picker.component';

/**
 * Defined module for all common UI elements used in other views.
 */

 @NgModule({
    declarations: [
        ChartCardLineComponent,
        DateTimePickerComponent
    ],
    imports: [
        CommonModule,
        ChartsModule,
        MatCardModule,
        MatDatepickerModule,
        MatInputModule,
        MatSelectModule
    ],
    exports: [
        ChartCardLineComponent,
        DateTimePickerComponent
    ]
 })
 export class CommonComponentsModule{}