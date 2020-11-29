import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

import { Reading } from 'src/app/models/reading/reading.model';
import { MessageService } from 'src/app/services/message.service';
import { ReadingApiService } from '../../services/reading-api.service';


@Component({
    selector: 'reading-form',
    templateUrl: './reading-form.component.html',
    styleUrls: ['./reading-form.component.css']
})
/**
 * ReadingFormComponent supports a form for users to enter manual tank readings.
 */
export class ReadingFormComponent implements OnInit{
    
    // Reading form model to capture input from the user
    readingForm:FormGroup;
    
    // ng function definitions
    constructor(private readingApi : ReadingApiService, private messages:MessageService, private router: Router){}

    ngOnInit(){
        this.readingForm = new FormGroup({
            ammonia: new FormControl(),
            nitrite: new FormControl(),
            nitrate: new FormControl(),
            ph: new FormControl(),
            temperature:  new FormControl()
        })
    }

    /**
     * Uses ReadingAPIService to send this form's reading to be saved. 
     */
    saveReading(){
        // Create a new reading model to send from form model
        const reading:Reading = {
            "ammonia_ppm": this.sanitizeNullValues(this.readingForm.value.ammonia),
            "nitrite_ppm": this.sanitizeNullValues(this.readingForm.value.nitrite),
            "nitrate_ppm": this.sanitizeNullValues(this.readingForm.value.nitrate),
            "ph": this.sanitizeNullValues(this.readingForm.value.ph),
            "temperature": this.sanitizeNullValues(this.readingForm.value.temperature)
        }

        // Send reading to backend and subscribe to the result
        this.readingApi
            .saveManualReading(reading)
            .subscribe(
                () => this.router.navigate(['/']),
                err => {
                    // Display error to the user
                    this.messages.setMessage(err)
                }            
            )
    }

    /**
     * Sanitizes null form input value as undefined.
     * @param input - any input entered by the user
     * @returns Unaltered input parameter if input was provided. Returns undefined otherwise.
     */
    private sanitizeNullValues(input:any): Number{
        return input === null || input === undefined ? undefined : input;
    }
}
