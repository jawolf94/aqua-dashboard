import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators'

import { Color } from 'ng2-charts';

import { CardChartData } from '@app/common-components/card-chart-data.model';
import { StringMap } from '@app/models/common/string-map.model';
import { ParameterStatus } from '@app/models/reading/parameter_status.model';
import { Reading } from '@app/models/reading/reading.model';
import { ChartUtilService } from '@app/services/chart-util.service';
import { MessageService } from '@app/services/message.service';
import { ReadingApiService } from '@app/services/reading-api.service';


/**
 * Component which defines the reading overview.
 * Displays an overview of the last reading and a table of all reading data
 */
@Component({
    selector: 'reading-dashboard',
    templateUrl: './reading-dashboard.component.html',
    styleUrls: ['./reading-dashboard.component.css']
})
export class ReadingDashboardComponent implements OnInit, OnDestroy{

    // Subscriptions to Reading endpoints
    lastReadingStatusSub: Subscription;
    lastReadingSub: Subscription;
    todaysReadingsSub: Subscription;

    // Class intance vars for recent reading data
    latestReading: Reading;
    todaysReadings: Reading[];

    // Mapping of labels/units used to display overview card data.
    cardLabels = {
        "ammonia_ppm": {
            "label": "Ammonia(NH3)",
            "unit": "ppm",
            "icon": "cached",
            "type": "number"
        },
    
        "nitrite_ppm": {
            "label": "Nitrite(N02)",
            "unit": "ppm",
            "icon": "cached",
            "type": "number"
        },
    
        "nitrate_ppm": {
            "label": "Nitrate(N03)",
            "unit": "ppm",
            "icon": "cached",
            "type": "number"
        }, 
    
        "ph": {
            "label": "PH",
            "unit": "",
            "icon": "cached",
            "type": "number"
        },
    
        "temperature": {
            "label": "Temperature",
            "unit": "F\xB0",
            "icon": "cached",
            "type": "number"
        },
        "timestamp":{
            "label": "",
            "unit": "",
            "icon": "access_time",
            "type": "date"
        }
    }

    // Chart display data & options
    chartData:CardChartData[];

    chartLineColor:Color[]= [
        {
            backgroundColor: 'rgba(128,164,179, 0.2)',
            borderColor: 'rgba(128,164,179,1)',
            pointBackgroundColor: 'rgba(170,191,199,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(170,191,199,0.8)'
        }
    ]


    // Parameters dynamically set based on window size
    layout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(
            ({matches}) => {
                if(matches){
                    return {
                        columns: 1,
                        overview: {
                            col_span: 1,
                            row_span: 1
                        },
                        charts: {
                            sampling: 4,
                            pointSize: 4,
                            pointRadius: 3
                        }
                    }
                }
                else{
                    return {
                        columns: 3,
                        overview: {
                            col_span: 1,
                            row_span: 1,
                        },
                        charts: {
                            sampling: 1,
                            pointSize: 4,
                            pointRadius: 3
                        }
                    }
                }
            }
        )
    );

    /**
     * Constructs ReadingDashboardComponent.
     * @param readingAPI API Service which represents tank reading data.
     * @param breakpointObserver Observer which represents the size of the screen
     */
    constructor(
        private readingAPI: ReadingApiService, 
        private messages:MessageService, 
        private breakpointObserver: BreakpointObserver,
        private chartUtil:ChartUtilService
    ){}

    /**
     * Initalizes this component. 
     * Subscribes to ReadingApiService and gets latest tank reading.
     */
    ngOnInit(){

        // Assemble charts before netowork calls to make page appear more responsive
        this.chartInit();

        // Subscribe to last reading enpoint
        this.lastReadingSub = this.readingAPI
            .getLatestReading()
            .subscribe(
                res => {
                    // Set latest reading and get parameter statuses.
                    this.latestReading = res;
                    this.updateIcons();
                },
                err => {
                    this.messages.setMessage(err);
                }
            );

        // Set up params to request today's readings
        var today: Date = new Date();
        var startOfDay:Date = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,0,0
        );

        // Subscribe to readingsBetween endpoint with readings
        this.todaysReadingsSub = this.readingAPI
            .getReadingsBetween(startOfDay)
            .subscribe(
                res=> {
                    // Set todaysReadings on resolution
                    this.todaysReadings = res;

                    // Process chart data for display
                    this.chartData = this.assembleAllChartData();

                },
                err => {
                    // Report the error to the user
                    this.messages.setMessage(err);

                    // Initalize the chart with no data
                    this.chartInit();     
                }
            )
    }

    /**
     * Called to initalizae charts with no reading data. Resets today's readings to empty list.
     */
    chartInit(){
        this.todaysReadings = [];
        this.chartData = this.assembleAllChartData();
    }

    /**
     * Called when this component is destroyed.
     * Unsubscribes from ReadingApiService
     */
    ngOnDestroy(){
        this.lastReadingSub.unsubscribe();
    }

    /**
     * Processes chart data for display on overview graphs for all desired parameters.
     * @returns CardChartData[] - Array of Chart Data. Each for use in sepreate chart-card-line components
     */
    assembleAllChartData():CardChartData[]{
        var charts:CardChartData[]= [];
        this.displayedGraphs.forEach(param => 
            {
                // Create StringMap for ChartUtil
                var label:StringMap<string> = {}
                label[param] = this.cardLabels[param]["label"]

                // Generate Data series & push to array
                var chart:CardChartData = this.chartUtil.generateChartDataFromReading(this.todaysReadings, label);
                charts.push(chart);
            }
        )

        return charts;
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
                .checkParameterStatus(paramStatus.reading_id)
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
                    err => {
                      // Report error to the user
                      this.messages.setMessage(err);
                      
                    }
                )
        }
    }


    /**
     * Generates a list of fields to display on the dashboard.
     * @returns List fields to display as keys for Reading Model properties.
     * List will be empty if no reading is available. 
     */
    get displayedOverviewCards(){
        // Check if latest reading was obtained and return keys for display
        if(this.latestReading != null){
            return Object.keys(this.cardLabels)
                .filter(key => Object.keys(this.latestReading).includes(key));
        }

        // Return empty list if no reading is available.
        return [];
    }

    /**
     * Generates an array of fields to display/generate graphs.
     * @returns Array of strings representing keys in a Reading.
     */
    get displayedGraphs(){
        return Object.keys(this.cardLabels)
            .filter(key => key !== 'timestamp');
    }

}