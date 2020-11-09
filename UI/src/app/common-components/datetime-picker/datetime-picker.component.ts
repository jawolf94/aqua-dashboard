import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';

/**
 * Defines string/value pairs for time selection display
 */
interface TimeSelectOption{
    option:string;
    value: number;
}

/**
 * A component which packages angaular material inputs allowing for a single datetime picker
 */
@Component({
    selector: 'datetime-picker',
    templateUrl: './datetime-picker.component.html',
    styleUrls: ['datetime-picker.component.css']
})
export class DateTimePickerComponent implements OnInit{

    // Default Values for hour and minutes
    @Input() selectedHour: number;
    @Input() selectedMinute: number;
    @Input() selectedDate: Date;

    // Output of full datetime selection
    @Output() dateTimeEvent: EventEmitter<Date>  = new EventEmitter<Date>();;

    // Arrays used to populate hour and minute selects
    hours:TimeSelectOption[];
    minutes:TimeSelectOption[];

    /**
     * Initalizes time selections with hour and minute values
     */
    ngOnInit(){

        // Set values for hours, minutes and timePeriod
        this.hours = this.setTimeOptions(0,23);
        this.minutes = this.setTimeOptions(0,59);

        // Make sure user inputs are in range - default to 12hr 00min otherwise
        if(this.invalidHours()){
            this.selectedHour = 0;
        }
        if(this.invalidMinutes()){
            this.selectedMinute = 0;
        }

        // Check if user provided a defualt date - otherwise use today
        if(!this.selectedDate){
            this.selectedDate = new Date()
        }

        // Set Output to match inital inputs
        this.emitDateOutput();

    }


    /**
     * @returns True if defaultHours is a valid number between 1 & 12
     */
    invalidHours(): boolean{
        return !this.selectedHour
            || this.selectedHour < 0
            || this.selectedHour > 23;
    }

    /**
     * @returns True if defaultMinutes is a valid number between 0 & 59
     */
    invalidMinutes(): boolean{
        return !this.selectedMinute
            || this.selectedMinute < 0
            || this.selectedMinute > 59
    }

    /**
     * Emit a Date object based on the user's datetime selection
     */
    emitDateOutput(){

        // Assemble datetime info on date object
        this.selectedDate.setHours(this.selectedHour);
        this.selectedDate.setMinutes(this.selectedMinute);
        
        // Default seconds to 0 
        // User can only select down to the minute
        this.selectedDate.setSeconds(0);

        // Emit event
        this.dateTimeEvent.emit(this.selectedDate);
    }

    /**
     * Creates an array of time values and lables between the given numbers (inclusive)
     * @param lowestValue - Lowest value in returned array
     * @param highestValue - Highest value in returned array
     * @returns List of TimeSelectOptions between the values passed
     */
    setTimeOptions(lowestValue:number, highestValue:number):TimeSelectOption[] {
        // Declare array to populate as empty array
        var options:TimeSelectOption[] = [];

        // Loop from lowestValue to highestValue
        for(let i=lowestValue; i<=highestValue; i++){

            // String which is 0 when time value is below 10
            var zeroDigit:string = i<10 ? "0" : "";

            // Push string value par into list
            options.push(
                {
                    option: zeroDigit + i.toString(),
                    value: i
                }
            )
        }

        // Return array of TimeSelectOptions
        return options;
    }


    /**
     * Updates component's private date value
     * @param event - Event emitted when the user updates the date input
     */
    updateDate(event: MatDatepickerInputEvent<Date>){
        this.selectedDate = event.value;
        this.emitDateOutput();
    }

    /**
     * Updates component's private hour value with the user's selection
     * @param event - Event emitted when the user updates the hour input
     */
    updateHour(event: MatSelectChange){
        this.selectedHour = event.value;
        this.emitDateOutput();
    }

    /**
     * Updates component's private minute value with the user's selection
     * @param event - Event emitted when the user updates the minute input
     */
    updateMinute(event: MatSelectChange){
        this.selectedMinute = event.value;
        this.emitDateOutput();
    }

}
