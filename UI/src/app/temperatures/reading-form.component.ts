import {Component} from '@angular/core';
import {DatePipe} from '@angular/common'
import {TemperaturesApiService} from './temperatures-api.service';
import {Router} from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'reading-form',
    templateUrl: './reading-form.component.html',
    providers: [DatePipe]
})
export class ReadingFormComponent{
    reading = {
        timestamp: new Date(),
        thermometer_number: 0,
        temperature: 0.0,
    }

    constructor(private temperatureApi : TemperaturesApiService, private router: Router){}

    updateTemperature(event : any){
        this.reading.temperature = event.target.value;
    }

    saveReading(){
        this.temperatureApi
            .saveReading(this.reading)
            .subscribe(
                () => this.router.navigate(['/']),
                err => alert(err)
            )
    }
}
