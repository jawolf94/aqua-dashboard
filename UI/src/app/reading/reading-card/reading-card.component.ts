import {Component, Input} from '@angular/core';

/**
 * Displays data for a specif reading parameters
 */
@Component({
    selector: 'reading-card',
    templateUrl: './reading-card.component.html',
    styleUrls: ['./reading-card.component.css']
})
export class ReadingCardComponent{
    // Reading parameter value 
    @Input() value: Number;

    // Reading parameter unit of measurement
    @Input() unit: string;

    // Name of reading parameter
    @Input() label: string;

    // String for material icon name
    @Input() icon: string; 

    // Boolean which can be set to true if displaying DateTime object
    @Input() isDateTime: Boolean = false;

}