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

import { CommonComponentsModule } from '@app/common-components/common-components.module';
import { ReadingDashboardComponent } from '@app/reading/reading-dashboard/reading-dashboard.component';
import { ReadingFormComponent } from '@app/reading/reading-form/reading-form.component';
import { ReadingRoutingModule } from '@app/reading/reading.routing';
import { ReadingApiService } from '@app/services/reading-api.service';

/**
 * Defines module which handles display and routing for all tank reading info.
 */
@NgModule({
    declarations: [
        ReadingDashboardComponent,
        ReadingFormComponent,
    ],
    imports: [
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
    exports: [
        ReadingFormComponent
    ],
    providers: [ReadingApiService]
})
export class ReadingModule{}
