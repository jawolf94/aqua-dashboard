import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { ReadingApiService } from '../reading-api.service';
import { Reading } from '../reading.model';

// Values stored in latest reading which are displayed as overview cards
const cardsToDisplay: string[] = ['ammonia_ppm', 'nitrite_ppm', 'nitrate_ppm', 'ph', 'temperature', 'timestamp'];

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

    // Reading model with latest reading data.
    latestReading: Reading;

    // Dictionary of labels/units used to display overview card data.
    cardLabels = {
        "ammonia_ppm": {
            "label": "Ammonia(NH3)",
            "unit": "ppm"
        },
    
        "nitrite_ppm": {
            "label": "Nitrite(N02)",
            "unit": "ppm"
        },
    
        "nitrate_ppm": {
            "label": "Nitrate(N03)",
            "unit": "ppm"
        }, 
    
        "ph": {
            "label": "PH",
            "unit": ""
        },
    
        "temperature": {
            "label": "Temperature",
            "unit": "F\xB0"
        },
        "timestamp":{
            "label": "Time",
            "unit": ""
        }
    }

    /**
     * Constructs ReadingDashboardComponent.
     * @param readingAPI API Service which retruns tank reading data.
     */
    constructor(private readingAPI: ReadingApiService){}

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
                },
                err => {console.log(err);}
            )
    }

    /**
     * Called when component is destroyed.
     * Unsubscribes from ReadingApiService
     */
    ngOnDestroy(){
        this.lastReadingSub.unsubscribe();
    }


    /**
     * Generates a list of fields to display on the dashboard.
     * @returns List fields to display as keys for Reading Model properties.
     * List will be empty if no reading is available. 
     */
    get displayedCards(){
        // Check if latest reading was obtained and return keys for display
        if(this.latestReading != null){
            return cardsToDisplay.filter(key => Object.keys(this.latestReading).includes(key));
        }

        // Return empty list if no reading is available.
        return [];
    }

}