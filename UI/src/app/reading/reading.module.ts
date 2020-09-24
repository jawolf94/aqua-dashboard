import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';

import {ReadingApiService} from './reading-api.service';
import {ReadingRoutingModule} from './reading.routing';
import { ReadingDashboardComponent } from './reading-dashboard/reading-dashboard.component';
import {ReadingFormComponent} from './reading-form/reading-form.component';
import {ReadingTableComponent} from './reading-table/reading-table.component';

@NgModule({
    declarations:[
        ReadingDashboardComponent,
        ReadingFormComponent,
        ReadingTableComponent
    ],
    imports:[
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatTableModule,
        MatToolbarModule,
        ReadingRoutingModule
    ],
    exports:[
        ReadingFormComponent,
        ReadingTableComponent
    ],
    providers: [ReadingApiService]
})
export class ReadingModule{}