import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Color } from 'ng2-charts';

import { CardChartData } from '@app/models/common/card-chart-data.model';
import { LayoutOptions } from '@app/models/common/layout-options.model';
import { StringMap } from '@app/models/common/string-map.model';
import { Reading } from '@app/models/reading/reading.model';
import { BreakpointService } from '@app/services/breakpoint.service';
import { ChartUtilService } from '@app/services/chart-util.service';
import { MessageService } from '@app/services/message.service';
import { ReadingApiService } from '@app/services/reading-api.service';
import { ParamLabels } from '@app/models/common/label.model';
import { LabelService } from '@app/services/label.service';




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

    // Subscription to breakpoint service & latest value
    breakpointSubscription:Subscription;
    layout:LayoutOptions;

    // Class intance vars for recent reading data
    latestReading: Reading;
    todaysReadings: Reading[];

    // Card display options
    labels:ParamLabels;
    displayedOverviewCards:string[] = ["ammonia_ppm", "nitrite_ppm", "nitrate_ppm", "ph", "temperature", "timestamp"];

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

    /**
     * Constructs ReadingDashboardComponent.
     * @param readingAPI API Service which represents tank reading data.
     * @param breakpointObserver Observer which represents the size of the screen
     */
    constructor(
        private breakpointService:BreakpointService,
        private chartUtil:ChartUtilService,
        private labelService:LabelService,
        private messages:MessageService, 
        private readingAPI: ReadingApiService
    ){}

    /**
     * Initalizes this component. 
     * Subscribes to ReadingApiService and gets latest tank reading.
     */
    ngOnInit(){

        // Subscribe to breakpoint service for layout formatting
        this.breakpointSubscription = this.breakpointService
        .getLayoutOptions()
        .subscribe(
            res => {
                // Set layout on success
                this.layout = res;
            },

            err => {
                // Log error on failure
                console.error(err);
            }
        )

        // Get Labels and Label keys for overview cards
        this.labels = this.labelService.getLabelSubset(this.displayedOverviewCards);

        // Assemble charts before netowork calls to make page appear more responsive
        this.chartInit();

        // Subscribe to last reading enpoint
        this.latestReading = null;
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
                    this.latestReading = null;
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

        // Subscribe to readingsBetween endpoint for today's readings
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
     * Called when this component is destroyed.
     * Unsubscribes from ReadingApiService
     */
    ngOnDestroy(){
        this.lastReadingSub.unsubscribe();
        this.breakpointSubscription.unsubscribe();
    }

    /**
     * Called to initalizae charts with no reading data. Resets today's readings to empty list.
     */
    chartInit(){
        this.todaysReadings = [];
        this.chartData = this.assembleAllChartData();
    }

    /**
     * Processes chart data for display on overview graphs for all desired parameters.
     * @returns CardChartData[] - Array of Chart Data. Each for use in separate chart-card-line components
     */
    assembleAllChartData():CardChartData[]{
        var charts:CardChartData[]= [];
        let displayedGraphs = this.displayedOverviewCards.filter(key => key !== 'timestamp');
        displayedGraphs.forEach(param => 
            {
                // Create StringMap for ChartUtil
                var label:StringMap<string> = {}
                label[param] = this.labels[param]?.["label"]

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
        if(this.latestReading.id){

            // Request status and subscribe.
            this.lastReadingStatusSub = this.readingAPI
                .checkParameterStatus(this.latestReading.id)
                .subscribe(
                    res=> {

                        // On success update the icons of each card
                        Object.keys(res).forEach(key => {
                            // If key exists in card list, update it
                            if( Object.keys(this.labels).includes(key) ){

                                // Display check if valid, wanring otherwise
                                this.labels[key]["icon"] = res[key] ? "check" : "report_problem";
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
}