import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit} from '@angular/core';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';

import { ChartDataSets } from 'chart.js';

import { TIMEZONE } from 'src/app/env';
import { CardChartData } from 'src/app/common-components/card-chart-data.model'
import { Reading } from 'src/app/models/reading/reading.model';
import { ReadingApiService } from 'src/app/services/reading-api.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
    selector: 'dynamic-chart-view',
    templateUrl: './dynamic-chart-view.component.html',
    styleUrls: ['./dynamic-chart-view.component.css']
})
export class DynamicChartViewComponent implements OnInit{

    // Default control options
    tomorrowDate:Date;

    // Datetimes selected by the user     
    selectedToDate:Date;
    selectedFromDate:Date;

    // Chart Data
    chartData:CardChartData;
    rawReadings:Reading[];

    // Possible Data Display Options
    displayOptionStates = {
        "ammonia_ppm": {
            "label": "Ammonia (NH3)",
        },
    
        "nitrite_ppm": {
            "label": "Nitrite (N02)",
        },
    
        "nitrate_ppm": {
            "label": "Nitrate (N03)",
        }, 
    
        "ph": {
            "label": "PH",
        },
    
        "temperature": {
            "label": "Temperature (F\xB0)",
        },
    }

    // Breakpoint observer to change page layout for different screensizes.
    layout = this.breakPointObserver.observe(Breakpoints.Handset).pipe(
        map(
            ({matches}) => {
                if(matches){
                    return {
                        columns: 1,
                        charts: {
                            sampling: 4,
                            pointSize: 4,
                            pointRadius: 3
                        }
                    }
                }
                else{
                    return {
                        columns: 2,
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

    // Contructor and ng function implmentations
    constructor(private breakPointObserver:BreakpointObserver, private messages:MessageService, private readingApi:ReadingApiService){}

    ngOnInit(){

        // Set tomorrow's date for default control set-up
        this.tomorrowDate = new Date();
        this.tomorrowDate.setDate(this.tomorrowDate.getDate() + 1)

        // Reset time to 0 hours, minutes, seconds, miroseconds
        this.tomorrowDate.setHours(0,0,0,0);

        // Init chart data to null
        this.chartData = null;
        this.rawReadings = null;
    }

    /**
     * Formats reading data into data for display in chart-card-line component
     */
    formatChartData():CardChartData{
        // Generate Chart Data
        var data:CardChartData = {
            chartDataSet:[],
            chartLabels:[]
        }

        // Return empty data set if no readings are available.
        if(!this.rawReadings){
            return data;
        }
       

        // Generate Data Series
        Object.keys(this.displayOptionStates).forEach(key =>
            {   
                // Create a new series for the display option
                var series:ChartDataSets = {
                    label:this.displayOptionStates[key]["label"],
                    data:[]
                }
               
                // Add data points from Reading matching display option
                this.rawReadings.forEach(reading => {
                    series.data.push(reading[key]);
                });

                // Push completed series into data
                data.chartDataSet.push(series);
            });

        //Generate Chart Labels
        data.chartLabels = this.rawReadings.map((obj) => {
            return formatDate(
                obj['timestamp'].toString() + "+00:00",
                'M/d/yy, HH:mm',
                'en-US',
                TIMEZONE)
        });

        // Set chartData to pass as input to card-chart-line component
        this.chartData = data;
    }


    /**
     * Updates selectedFromDate with the user's input
     * @param selectedDate event emitted when datetimepicker's value changes
     */
    fromDateSelected(selectedDate:Date){
        this.selectedToDate = selectedDate
        this.requestData();
    }

    /**
     * Updates selectedToDate with the user's input
     * @param selectedDate event emitted when datetimepicker's value changes
     */
    toDateSelected(selectedDate:Date){
        this.selectedFromDate = selectedDate;
        this.requestData();
    }

    /**
     * Requests data from reading-api service between to/from datetime selections.
     */
    requestData(){
        this.readingApi
            .getReadingsBetween(this.selectedFromDate, this.selectedToDate)
            .subscribe(
                res => {
                    this.rawReadings = res;
                    this.formatChartData();
                },
                err => {
                    // Report Error to the user
                    this.messages.setMessage(err);
                }
            );
    }
}
