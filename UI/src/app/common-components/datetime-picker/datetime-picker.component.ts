import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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

    // Inital values for date, hour and, minutes
    @Input() initalHour: number;
    @Input() initalMinute: number;
    @Input() initalDate: Date;

    // Parent FormGroup - passed in when used with ngForms
    @Input() parentForm:FormGroup = null;

    // Output of full datetime selection
    @Output() dateTimeEvent: EventEmitter<Date>  = new EventEmitter<Date>();

    // Arrays used to populate hour and minute select options
    hours:TimeSelectOption[];
    minutes:TimeSelectOption[];

    // ngForm for user inputs
    dateForm:FormGroup;

    // Interal represenation of the ngModel as a Date object
    dateSelection:Date;


    /**
     * Initalizes time selections with hour and minute values
     */
    ngOnInit(){

         // Set values for hours, minutes and timePeriod
         this.hours = this.setTimeOptions(0,23);
         this.minutes = this.setTimeOptions(0,59);

        // Make sure default inputs are in range - default to 12hr 00min otherwise
        if(this.invalidHours()){
            this.initalHour = 0;
        }
        if(this.invalidMinutes()){
            this.initalMinute = 0;
        }

        // Check if user provided a defualt date
        if(!this.initalDate){
            // Use today for intital values if none was provided
            this.initalDate = new Date();
        }
       

        //Create form for datetime inputs
        this.dateForm = new FormGroup({
            date: new FormControl(this.initalDate),
            hour: new FormControl(this.initalHour),
            minute: new FormControl(this.initalMinute)
        })

        // Add timestamp input field to parentComponent if specified
        if(this.parentForm){
            this.parentForm.addControl('timestamp',new FormControl(this.dateSelection))
        }

        // Set internal model to match inital inputs
        this.modelChange();

        
        // Subscribe to future model changes
        this.dateForm.valueChanges.subscribe(
           () => this.modelChange()
        )  

    }

    modelChange(){

        // Create a new date object with the user's input
        this.dateSelection = new Date(this.dateForm.value.date);

        // Set date object's hours and minutes to the user's input
        // Default seconds and microseconds to 0 - user cannot input these
        this.dateSelection.setHours(
            this.dateForm.value.hour,
            this.dateForm.value.minute,
            0,0);

        // Update field value if used in a FormGroup
        if(this.parentForm){
            this.parentForm.patchValue({
                'timestamp': this.dateSelection
            })
        }

        // Emit output for non FormGroup use cases
        this.emitDateOutput();
    }

    /**
     * Emit a Date object based on the user's datetime selection
     */
    emitDateOutput(){

        // Emit new date value
        this.dateTimeEvent.emit(this.dateSelection);
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
     * @returns True if defaultHours is a valid number between 1 & 12
     */
    invalidHours(): boolean{
        return !this.initalHour
            || this.initalHour < 0
            || this.initalHour > 23;
    }

    /**
     * @returns True if defaultMinutes is a valid number between 0 & 59
     */
    invalidMinutes(): boolean{
        return !this.initalMinute
            || this.initalMinute < 0
            || this.initalMinute > 59
    }
}
