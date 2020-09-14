import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {TemperaturesApiService} from './temperatures/temperatures-api.service';
import {Temperature} from './temperatures/temperature.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'UI';
    temperatureListSubs: Subscription;
    temperatureList: Temperature[];

    constructor(private temperaturesApi: TemperaturesApiService){

    }

    ngOnInit() {
      this.temperatureListSubs = this.temperaturesApi
        .getTemperatures()
        .subscribe(res => {
          this.temperatureList = res;
        },
        console.error
        );
    }

    ngOnDestroy(){
      this.temperatureListSubs.unsubscribe();
    }
}
