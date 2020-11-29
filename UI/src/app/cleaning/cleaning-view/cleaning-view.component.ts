import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { Cleaning } from 'src/app/models/cleaning/cleaning.model';
import { CleaningApiService } from 'src/app/services/cleaning-api.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
    selector: 'cleaning-view',
    templateUrl: './cleaning-view.component.html',
    styleUrls: ['./cleaning-view.component.css']
})
export class CleaningViewComponent implements OnInit{

    // overview-card labels for each cleaning value
    cardLabels = {
        "pct_change":{
            "label": "Changed",
            "unit": "%",
            "icon": "waves",
            "type": "number"
        },
        "filter_change":{
            "label": "Filter Change",
            "unit": "",
            "icon": "eco",
            "type": "boolean"
        },
        "timestamp":{
            "label": "",
            "type": "date",
            "unit": "",
            "icon": "access_time"
        }
    }

    // Defines page layout based on the breakpoint size
    layout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(
            ({matches}) => {
                if(matches){
                    return {
                        columns: 1,
                        col_span: 1,
                        row_span: 1
                    }
                }
                else{
                    return {
                        columns: 3,
                        col_span: 1,
                        row_span: 1,
                    }
                }
            }
        )
    );

    // Cleaning log data
    allCleaningLogs:Cleaning[];
    latestCleaning:Cleaning;


    // Constructor and ng method implmentations

    constructor(private breakpointObserver:BreakpointObserver, private cleaningApi:CleaningApiService, private messages:MessageService){}

    ngOnInit(){
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
