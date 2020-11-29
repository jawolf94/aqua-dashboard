import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Router } from '@angular/router';

import { Cleaning } from "src/app/models/cleaning/cleaning.model";
import { CleaningApiService } from "src/app/services/cleaning-api.service";
import { MessageService } from "src/app/services/message.service";

@Component({
    selector: 'add-cleaning',
    templateUrl: 'add-cleaning.component.html',
    styleUrls: ['./add-cleaning.component.css']
})
export class AddCleaningComponent implements OnInit{

    // Values for form inputs in the component
    cleaning:Cleaning;

    // Slider inital values
    sliderMin:number;
    sliderMax:number;
    sliderInitalValue:number;

    // Date inital value
    datetimeInitalValue:Date;

    // Slide Toggle Labels & Inital Value
    toggleInitalValue:Boolean;
    toggleLabel:string;
    toggleStrings = {
        notChanged: "No Filter Change",
        changed: "Filter Changed"
    }

    constructor(private cleaningApi:CleaningApiService, private messages:MessageService, private router:Router){}


    ngOnInit(){

        // Create new cleaning
        this.cleaning = new Cleaning()

        // Set slider starting values
        this.sliderMin = 0;
        this.sliderMax = 100;
        this.sliderInitalValue = 15
        this.cleaning.pct_change = this.sliderInitalValue / (this.sliderMax - this.sliderMin);

        // Set Date starting values
        // timestamp will be updated when datetime emits intal value
        this.datetimeInitalValue = new Date();
        this.datetimeInitalValue.setHours(0,0,0,0);

        // Set slide toggle intial values
        this.toggleInitalValue = false;
        this.cleaning.filter_change = this.toggleInitalValue;
        this.setToggleLabel();
    }

    /**
     * Formats the thumblabel displayed while changing the slider value.
     * @param value - Current value of the slider
     * @returns string to display in the thumblabel
     */
    formatLabel(value:number):string{
        return value + '%'
    }

    /**
     * Calls CleaningApiSerivce to save latest cleaning data in DB.
     */
    saveCleaning(){
        console.log("Clicked")
        this.cleaningApi
            .addCleaning(this.cleaning)
            .subscribe(
                res => {this.router.navigate(['/cleaning'])},
                err => {this.messages.setMessage(err)}
            );
    }

    /**
     * Sets slide-toggle label to match value of filter_change in cleaning model.
     */
    setToggleLabel(){
        // Update label to reflect toggle state
        this.toggleLabel = this.cleaning.filter_change
            ? this.toggleStrings.changed
            : this.toggleStrings.notChanged
    }

    /**
     * Stores slider input value as a percentage.
     * @param event - Event emitted when slider value was changed.
     */
    updateSliderInput(event:MatSliderChange){
        this.cleaning.pct_change = event.value/(this.sliderMax - this.sliderMin);
    }

    /**
     * Stores datetime input value.
     * @param event - Event emitted when datetime was changed.
     */
    updateTimeInput(event:Date){
        this.cleaning.timestamp = event;
    }

    /**
     * Updates the value of filter_changed when slide-toggle is changed. Updates label.
     * @param event - Event emitted when slide-toggle is changed.
     */
    updateToggleInput(event:MatSlideToggleChange){
        // Store new value
        this.cleaning.filter_change = event.checked;
        this.setToggleLabel();
    }
}