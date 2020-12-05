import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ChartsModule } from 'ng2-charts';

import { ChartCardLineComponent } from '@app/common-components/chart-card-line/chart-card-line.component';
import { DateTimePickerComponent } from '@app/common-components/datetime-picker/datetime-picker.component';
import { MessageComponent } from '@app/common-components/message-banner/message-banner.component';
import { OverviewCardComponent } from '@app/common-components/overview-card/overview-card.component';

/**
 * Defined module for all common UI elements used in other views.
 */

 @NgModule({
    declarations: [
        ChartCardLineComponent,
        DateTimePickerComponent,
        MessageComponent,
        OverviewCardComponent
    ],
    imports: [
        CommonModule,
        ChartsModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule
    ],
    exports: [
        ChartCardLineComponent,
        DateTimePickerComponent,
        MessageComponent,
        OverviewCardComponent
    ]
 })
 export class CommonComponentsModule{}