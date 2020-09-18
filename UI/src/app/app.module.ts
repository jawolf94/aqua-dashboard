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
import {ReadingFormComponent} from './temperatures/reading-form.component';
import {TemperatureComponent} from './temperatures/temperature.component';
import {TemperaturesApiService} from './temperatures/temperatures-api.service';

const appRoutes: Routes = [
  {path: 'add-reading', component: ReadingFormComponent},
  {path: '', component: TemperatureComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ReadingFormComponent,
    TemperatureComponent
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
  providers: [TemperaturesApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
