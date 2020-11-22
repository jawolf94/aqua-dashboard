import {Component, Input, OnInit} from '@angular/core';

import { TIMEZONE } from 'src/app/env';

/**
 * Displays data for a specific reading parameters
 */
@Component({
    selector: 'overview-card',
    templateUrl: './overview-card.component.html',
    styleUrls: ['./overview-card.component.css']
})
export class OverviewCardComponent implements OnInit{
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