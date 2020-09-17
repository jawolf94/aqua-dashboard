import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {Temperature} from './temperature.model';
import {TemperaturesApiService} from './temperatures-api.service';

@Component({
    selector: 'temeratures',
    templateUrl: './temperature.component.html'    
})

export class TemperatureComponent implements OnInit, OnDestroy {
    temperatureListSubs: Subscription;
    temperatureList: Temperature[];

    constructor(private temperatureAPI: TemperaturesApiService){}

    ngOnInit(){
        this.temperatureListSubs = this.temperatureAPI
            .getTemperatures()
            .subscribe(
                res => {this.temperatureList = res;},
                err => { console.log(err); }
            )
    }

    ngOnDestroy(){
        this.temperatureListSubs.unsubscribe();
    }
}
