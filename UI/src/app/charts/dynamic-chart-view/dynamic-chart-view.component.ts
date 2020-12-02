import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit} from '@angular/core';

import { map } from 'rxjs/operators';

import { CardChartData } from '@app/common-components/card-chart-data.model';
import { StringMap } from '@app/models/common/string-map.model';
import { Reading } from '@app/models/reading/reading.model';
import { ChartUtilService } from '@app/services/chart-util.service';
import { ReadingApiService } from '@app/services/reading-api.service';
import { MessageService } from '@app/services/message.service';

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
    chartSeriesLabels:StringMap<string> = {
        "ammonia_ppm": "Ammonia (NH3)",
        "nitrite_ppm": "Nitrite (N02)",
        "nitrate_ppm": "Nitrate (N03)",    
        "ph": "PH",
        "temperature": "Temperature (F\xB0)",
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
    constructor(
        private breakPointObserver:BreakpointObserver, 
        private messages:MessageService, 
        private readingApi:ReadingApiService,
        private chartUtil:ChartUtilService
    ){}

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
                    this.chartData = this.chartUtil.generateChartDataFromReading(this.rawReadings, this.chartSeriesLabels)
                },
                err => {
                    // Report Error to the user
                    this.messages.setMessage(err);
                }
            );
    }
}
