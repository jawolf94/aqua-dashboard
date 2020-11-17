import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgModule } from '@angular/core';

import { CommonComponentsModule } from 'src/app/common-components/common-components.module';
import { AddCleaningComponent } from './add-cleaning/add-cleaning.component';
import { CleaningRoutingModule } from './cleaning.routing';

@NgModule({
    declarations: [
        AddCleaningComponent
    ],
    imports:[
        CommonModule,
        CleaningRoutingModule,
        CommonComponentsModule,
        MatButtonModule,
        MatCardModule,
        MatSliderModule,
        MatSlideToggleModule
    ]
})
export class CleaningModule{}