import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {Reading} from 'src/app/models/reading/reading.model';
import { MessageService } from 'src/app/services/message.service';
import {ReadingApiService} from '../../services/reading-api.service';


@Component({
    selector: 'reading-form',
    templateUrl: './reading-form.component.html'
})
/**
 * ReadingFormComponent supports a form for users to enter manual tank readings.
 */
export class ReadingFormComponent{
    
    // Reading entered by the user
    reading: Reading;
    
    constructor(private readingApi : ReadingApiService, private messages:MessageService, private router: Router){
        this.reading = new Reading();
    }

    /**
     * Updates this form's ammonia value with the user's input.
     * @param event - UI driven event triggered by keyup
     */
    updateAmmonia(event:any){
        this.reading.ammonia_ppm = this.strpNonNum(event.target.value);
    }

    /**
     * Updates this form's nitrate value with the user's input.
     * @param event - UI driven event triggered by keyup
     */
    updateNitrite(event:any){
        this.reading.nitrite_ppm = this.strpNonNum(event.target.value);
    }

     /**
     * Updates this form's nitrate value with the user's input.
     * @param event - UI driven event triggered by keyup
     */
    updateNitrate(event:any){
        this.reading.nitrate_ppm = this.strpNonNum(event.target.value);
    }

     /**
     * Updates this form's ph value with the user's input.
     * @param event - UI driven event triggered by keyup
     */
    updatePH(event: any){
        this.reading.ph = this.strpNonNum(event.target.value);
    }

     /**
     * Updates this form's temperature value with the user's input.
     * @param event - UI driven event triggered by keyup
     */
    updateTemperature(event : any){
        this.reading.temperature = this.strpNonNum(event.target.value);
    }

    /**
     * Uses ReadingAPIService to send this form's reading to be saved. 
     */
    saveReading(){
        this.readingApi
            .saveManualReading(this.reading)
            .subscribe(
                () => this.router.navigate(['/']),
                err => {
                    // Display error to the user
                    this.messages.setMessage(err)
                }            
            )
    }

    /**
     * Checks if the value passed is a valid number.
     * @param input - any input entered by the user
     * @returns Unaltered input parameter if input is a valid number. Returns undefined otherwise.
     */
    private strpNonNum(input:any): Number{
        return isNaN(input) || input ==='' ? undefined : input;
    }
}
