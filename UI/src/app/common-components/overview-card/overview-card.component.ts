import {Component, Input, OnInit} from '@angular/core';

import { TIMEZONE } from '@app/env';

/**
 * Formats & displays data passed in by the parent
 */
@Component({
    selector: 'overview-card',
    templateUrl: './overview-card.component.html',
    styleUrls: ['./overview-card.component.css']
})
export class OverviewCardComponent implements OnInit{
    // Value of the data
    @Input() value: any;

    // Type of data displayed
    @Input() valueType:string

    // Unit of measurement for value
    @Input() unit: string;

    // Name of value
    @Input() label: string;

    // String for materials-icon. String is name of icon.
    @Input() icon: string; 

    ngOnInit(){

        // Check if input exists and is a known type
        if(this.value === null || this.value === undefined || !this.isKnownType()){
            // If not set or unknown then set to null
            this.value = null;
            this.valueType = "unknown"

            // Stop processing further formatting
            return;
        }

        // Specify UTC timestamp
        if(this.isDate()){
            this.value = this.value.toString() + "+00:00";
        }
    }

    /**
     * @returns True - if type of input passed in is a boolean.
     */
    isBool(): Boolean{
        return this.valueType.toLowerCase() === 'boolean';
    }

    /**
     * @returns True - if type of input passed in is a date
     */
    isDate(): Boolean{
        return this.valueType.toLowerCase() === 'date';
    }

    /**
     * @returns True - if type of input passed in is a number
     */
    isNumber():Boolean{
        return this.valueType.toLowerCase() === "number"
    }

    /**
     * @returns True - if type if boolean, date, or number were specifed as the type.
     */
    isKnownType():Boolean{
        return (this.isBool() || this.isDate() || this.isNumber())
            && this.valueType !== 'unknown';
    }

}