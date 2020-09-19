import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {TemperaturesApiService} from './temperatures-api.service';

@Component({
    selector: 'reading-form',
    templateUrl: './reading-form.component.html'
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
        this.router.navigate(['/']);
        // ToDo: Uncomment when API is available
        // this.temperatureApi
        //     .saveReading(this.reading)
        //     .subscribe(
        //         () => this.router.navigate(['/']),
        //         err => alert(err)
        //     )
    }
}
