import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {ReadingApiService} from './readings/reading-api.service';
import {ReadingTableComponent} from './readings/reading-table/reading-table.component';
import {ReadingFormComponent} from './readings/manual-reading-form/reading-form.component';

const appRoutes: Routes = [
  {path: 'add-reading', component: ReadingFormComponent},
  {path: '', component: ReadingTableComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ReadingFormComponent,
    ReadingTableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  providers: [ReadingApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
