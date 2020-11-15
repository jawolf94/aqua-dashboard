import {Component, Input, OnInit} from '@angular/core';

import { TIMEZONE } from 'src/app/env';

/**
 * Displays data for a specific reading parameters
 */
@Component({
    selector: 'reading-card',
    templateUrl: './reading-card.component.html',
    styleUrls: ['../../app.component.css', './reading-card.component.css']
})
export class ReadingCardComponent implements OnInit{
    // Reading parameter value 
    @Input() value: Number;
    private date:String;

    // Reading parameter unit of measurement
    @Input() unit: string;

    // Name of reading parameter
    @Input() label: string;

    // String for material icon name
    @Input() icon: string; 

    // Boolean which can be set to true if displaying DateTime object
    @Input() isDateTime: Boolean = false;


    ngOnInit(){

        // Check is user specified datetime prototype as input
        if(this.isDateTime){

            // Define UTC timestamp for proper conversion
            this.date = this.value.toString() + "+00:00"
        }
    }

}