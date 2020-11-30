import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

import { AddCleaningComponent } from './add-cleaning/add-cleaning.component';
import { CleaningLogComponent } from './cleaning-log/cleaning-log.component';
import { CleaningRoutingModule } from './cleaning.routing';
import { CleaningViewComponent } from './cleaning-view/cleaning-view.component';

@NgModule({
    declarations: [
        AddCleaningComponent,
        CleaningLogComponent,
        CleaningViewComponent,
    ],
    imports:[
        CleaningRoutingModule,
        CommonComponentsModule,
        CommonModule,
        CommonComponentsModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatPaginatorModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatTableModule,
        RouterModule,
        ReactiveFormsModule
    ]
})
export class CleaningModule{}