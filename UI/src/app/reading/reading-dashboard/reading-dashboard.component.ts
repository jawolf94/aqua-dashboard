import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators'

import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { Reading } from '../models/reading.model';
import { ParameterStatus } from '../models/parameter_status.model';
import { ReadingApiService } from '../reading-api.service';
import { CardChartData } from '../../common-components/card-chart-data.model';

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
                            sampling: 1,
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
    constructor(private readingAPI: ReadingApiService, private breakpointObserver: BreakpointObserver){}

    /**
     * Initalizes this component. 
     * Subscribes to ReadingApiService and gets latest tank reading.
     */
    ngOnInit(){

        // Subscribe to last reading enpoint
        this.lastReadingSub = this.readingAPI
            .getLatestReading()
            .subscribe(
                res => {
                    // Set latest reading and get parameter statuses.
                    this.latestReading = res;
                    this.updateIcons();
                },
                err => {console.log(err);}
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
                err => {console.log(err);}
            )
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
                // Generate Data series 
                var chart:CardChartData = this.formatChartData(param);
                charts.push(chart);
            }
        )

        return charts;
    }

    /**
     * Formats reading data into CardChartData for a line charts.
     * @param key - String specifying data to display. Should be key in readings.
     * @returns - Data series representing that paramater
     */
    formatChartData(key: string):CardChartData{

        // Check if today's data is available
        if(!Object.keys(this.cardLabels).includes(key)
            || !this.todaysReadings
            || this.todaysReadings.length <= 1){

            // Return empty series data if key was not present.
            return null;
        }

        // Create Series Data
        var series:ChartDataSets = {
            label: this.cardLabels[key]["label"],
            data: []
        };
      

        // Create Label Array
        var labels:Label[] = []

        // Format each reading into a DataPoint
        this.todaysReadings.forEach(reading => {
            if(Object.keys(reading).includes(key)){
                
                // Add data to series
                series.data.push(reading[key]);

                // Create label for x-axis
                var time:string = formatDate(
                    reading['timestamp'],
                    "shortTime",
                    "en-US",
                    "EST");

                    labels.push(time);
            }
            
        });

        return {chartDataSet: [series], chartLabels: labels};
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