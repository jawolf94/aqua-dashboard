import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Cleaning } from '@app/models/cleaning/cleaning.model';
import { ParamLabels } from '@app/models/common/label.model';
import { LayoutOptions } from '@app/models/common/layout-options.model';
import { BreakpointService } from '@app/services/breakpoint.service';
import { CleaningApiService } from '@app/services/cleaning-api.service';
import { LabelService } from '@app/services/label.service';
import { MessageService } from '@app/services/message.service';

@Component({
    selector: 'cleaning-view',
    templateUrl: './cleaning-view.component.html',
    styleUrls: ['./cleaning-view.component.css']
})
export class CleaningViewComponent implements OnInit, OnDestroy{

    // overview-card labels for each cleaning value
    cardLabels:ParamLabels;

    // BreakpointService subscription and latest layout options
    breakpointSubscription:Subscription;
    layout:LayoutOptions;

    // Cleaning log data
    allCleaningLogs:Cleaning[];
    latestCleaning:Cleaning;

    // Constructor and ng method implmentations

    constructor(
        private breakpointService:BreakpointService, 
        private cleaningApi:CleaningApiService,
        private labelService:LabelService, 
        private messages:MessageService){}

    ngOnInit(){
        // Subscribe to breakpoint service
        this.breakpointSubscription = this.breakpointService
            .getLayoutOptions()
            .subscribe(
                res => {
                    // Set latest layout on success
                    this.layout = res;
                },
                err => {
                    // Log error to console on failure
                    console.error(err);
                }
            );

        // Get labels for overview cards
        this.cardLabels = this.labelService.getAllLabels()
            
        // Initalize cleaning data
        this.allCleaningLogs = [];
        this.latestCleaning = null;

        // Retrieve latest cleaning logs
        this.cleaningApi.getCleanings()
            .subscribe(
                res => {
                    // Set Component instance vars
                    this.allCleaningLogs = res;
                    this.setLatestCleaning();
                },
                err => { 
                    // Display error message to the user
                    this.messages.setMessage(err) 

                    // Ensure cleaning log is set to empty set of data
                    this.allCleaningLogs = [];
                }
            );
    }

    ngOnDestroy(){
        this.breakpointSubscription.unsubscribe();
    }

    /**
     * Gets the value of a specifed key from the latest cleaning
     * @param key - Key to retieve from cleaning
     */
    getValueFromLatest(key:string):any{
        // Check if latest cleaning exists and includes specifed key
        if(this.latestCleaning && Object.keys(this.latestCleaning).includes(key)){

            // Return value of specifed key
            return key === "pct_change" ?
                this.latestCleaning[key] * 100
                :this.latestCleaning[key];
        }

        // Return null if cleaning does not exists or key is invalid
        return null
    }

    /**
     * Sets latestCleaning from allCleaningLogs
     */
    setLatestCleaning(){
        // Check if allCleaningLog has data
        if(this.allCleaningLogs && this.allCleaningLogs.length > 0){
            // Set latest cleaning. Data is guaranteed in desc timestamp order.
            this.latestCleaning = this.allCleaningLogs[0];
        }
    }

    // Getters for the template

    /**
     * Returns keys in cardLabels for use in the template
     */
    get allCardLabels(){

        // Check if latest cleaning was obtained
        if(this.latestCleaning){

            // Return array of keys to display which exists in the latest cleaning
            return Object.keys(this.cardLabels).filter(
                key => Object.keys(this.latestCleaning).includes(key)
            );
        }
        
        // Return empty list if no cleaning data is available
        return [];
    }

}
