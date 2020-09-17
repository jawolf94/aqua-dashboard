import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import {TemperaturesApiService} from './temperatures/temperatures-api.service';

import {ReadingFormComponent} from './temperatures/reading-form.component';
import {TemperatureComponent} from './temperatures/temperature.component'

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
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  providers: [TemperaturesApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
