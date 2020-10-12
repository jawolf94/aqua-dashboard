import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import {map} from 'rxjs/operators'

import { ReadingApiService } from '../reading-api.service';
import { Reading } from '../models/reading.model';
import { ParameterStatus } from '../models/parameter_status.model';

/**
 * Component which defines the reading overview.
 * Displays an overview of the last reading and a table of all reading data
 */
@Component({
    selector: 'reading-dashboard',
    templateUrl: './reading-dashboard.component.html'
})
export class ReadingDashboardComponent implements OnInit, OnDestroy{

    // Subscritopn to service returing the latest reading.
    lastReadingSub: Subscription;

    // Subscription to service returning reading status.
    lastReadingStatusSub: Subscription;

    // Reading model with latest reading data.
    latestReading: Reading;

    // Dictionary of labels/units used to display overview card data.
    cardLabels = {
        "ammonia_ppm": {
            "label": "Ammonia(NH3)",
            "unit": "ppm",
            "icon": "cached"
        },
    
        "nitrite_ppm": {
            "label": "Nitrite(N02)",
            "unit": "ppm",
            "icon": "cached"
        },
    
        "nitrate_ppm": {
            "label": "Nitrate(N03)",
            "unit": "ppm",
            "icon": "cached"
        }, 
    
        "ph": {
            "label": "PH",
            "unit": "",
            "icon": "cached"
        },
    
        "temperature": {
            "label": "Temperature",
            "unit": "F\xB0",
            "icon": "cached"
        },
        "timestamp":{
            "label": "",
            "unit": "",
            "icon": "access_time"
        }
    }

    // GridList parameters based on window size.
    layout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(
            ({matches}) => {
                if(matches){
                    return {
                        columns: 1,
                        overview: {
                            col_span: 1,
                            row_span: 1
                        }
                    }
                }
                else{
                    return {
                        columns: 3,
                        overview: {
                            col_span: 1,
                            row_span: 1,
                        }
                    }
                }
            }
        )
    );

    /**
     * Constructs ReadingDashboardComponent.
     * @param readingAPI API Service which retruns tank reading data.
     */
    constructor(private readingAPI: ReadingApiService, private breakpointObserver: BreakpointObserver){}

    /**
     * Initalizes this component. 
     * Subscribes to ReadingApiService and gets latest tank reading.
     */
    ngOnInit(){
        this.lastReadingSub = this.readingAPI
            .getLatestReading()
            .subscribe(
                res => {
                    this.latestReading = res;
                    this.updateIcons()
                },
                err => {console.log(err);}
            );
    }

    /**
     * Called when component is destroyed.
     * Unsubscribes from ReadingApiService
     */
    ngOnDestroy(){
        this.lastReadingSub.unsubscribe();
    }

    /**
     * Updates the icons on the overview cards depending on their parameter's status.
     */
    updateIcons(){
        if(this.latestReading.id != null){
            // Create ParamaterStatus object for service to check parameters
            var paramStatus:ParameterStatus = new ParameterStatus();
            paramStatus.reading_id = this.latestReading.id;

            // Request status and subscribe.
            this.lastReadingStatusSub = this.readingAPI
                .checkParameterStatus(paramStatus)
                .subscribe(
                    res=> {
                        // On success update the icons of each card
                        Object.keys(res).forEach(key => {
                            // If key exists in card list, update it
                            if( Object.keys(this.cardLabels).includes(key) ){

                                // Display check if valid, wanring otherwise
                                this.cardLabels[key]["icon"] = res[key] ? "check" : "report_problem";
                            }
                        });
                        
                    },
                    err => {console.log(err); }
                )
        }
    }


    /**
     * Generates a list of fields to display on the dashboard.
     * @returns List fields to display as keys for Reading Model properties.
     * List will be empty if no reading is available. 
     */
    get displayedCards(){
        // Check if latest reading was obtained and return keys for display
        if(this.latestReading != null){
            return Object.keys(this.cardLabels)
                .filter(key => Object.keys(this.latestReading).includes(key));
        }

        // Return empty list if no reading is available.
        return [];
    }

}