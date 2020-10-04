import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatToolbarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
