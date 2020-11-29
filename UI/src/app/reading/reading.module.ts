import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { CommonComponentsModule } from '../common-components/common-components.module';
import { ReadingApiService } from '../services/reading-api.service';
import { ReadingRoutingModule } from './reading.routing';
import { ReadingDashboardComponent } from './reading-dashboard/reading-dashboard.component';
import { ReadingFormComponent } from './reading-form/reading-form.component';

/**
 * Defines module which handles display and routing for all tank reading info.
 */
@NgModule({
    declarations:[
        ReadingDashboardComponent,
        ReadingFormComponent,
    ],
    imports:[
        CommonModule,
        CommonComponentsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatGridListModule,
        MatTableModule,
        MatToolbarModule,
        ReactiveFormsModule,
        ReadingRoutingModule,
        RouterModule
    ],
    exports:[
        ReadingFormComponent
    ],
    providers: [ReadingApiService]
})
export class ReadingModule{}