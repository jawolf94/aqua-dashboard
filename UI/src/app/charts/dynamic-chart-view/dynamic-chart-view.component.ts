import { Component, OnDestroy, OnInit} from '@angular/core';

import { Subscription } from 'rxjs';

import { CardChartData } from '@app/models/common/card-chart-data.model';
import { LayoutOptions } from '@app/models/common/layout-options.model';
import { ParamLabels } from '@app/models/common/label.model';
import { Reading } from '@app/models/reading/reading.model';
import { BreakpointService } from '@app/services/breakpoint.service';
import { ChartUtilService } from '@app/services/chart-util.service';
import { LabelService } from '@app/services/label.service';
import { MessageService } from '@app/services/message.service';
import { ReadingApiService } from '@app/services/reading-api.service';



@Component({
    selector: 'dynamic-chart-view',
    templateUrl: './dynamic-chart-view.component.html',
    styleUrls: ['./dynamic-chart-view.component.css']
})
export class DynamicChartViewComponent implements OnInit, OnDestroy{

    // Default control options
    tomorrowDate: Date;

    // Datetimes selected by the user
    selectedToDate: Date;
    selectedFromDate: Date;

    // Chart Data
    chartData: CardChartData;
    displayedParams = ['ammonia_ppm', 'nitrite_ppm', 'nitrate_ppm', 'ph', 'temperature'];
    chartSeriesLabels: Map<string, string>;
    rawReadings: Reading[];

    // Subscription to BreakpointService and the latest value
    layout: LayoutOptions;
    breakpointSubscription: Subscription;

    // Contructor and ng function implmentations
    constructor(
        private breakpointService: BreakpointService,
        private chartUtil: ChartUtilService,
        private labelService: LabelService,
        private messages: MessageService,
        private readingApi: ReadingApiService,
    ){}


    ngOnInit(): void{

        // Subscribe to breakpoint service
        this.breakpointSubscription = this.breakpointService
            .getLayoutOptions()
            .subscribe(
                res => {
                    // Set layout on resolution of promise
                    this.layout = res;
                },
                err => {
                    // Report any errors to the console
                    console.error(err);
                }
            );

        // Create Map of parameters & labels for chart rendering
        this.chartSeriesLabels = new Map<string, string>();
        const labels: ParamLabels = this.labelService.getLabelSubset(this.displayedParams);
        Object.keys(labels).forEach( param => {
                this.chartSeriesLabels.set(param, labels[param].label);
        });

        // Set tomorrow's date for default control set-up
        this.tomorrowDate = new Date();
        this.tomorrowDate.setDate(this.tomorrowDate.getDate() + 1);

        // Reset time to 0 hours, minutes, seconds, miroseconds
        this.tomorrowDate.setHours(0, 0, 0, 0);

        // Init chart data to null
        this.chartData = null;
        this.rawReadings = null;
    }

    ngOnDestroy(): void{
        this.breakpointSubscription.unsubscribe();
    }

    /**
     * Updates selectedFromDate with the user's input
     * @param selectedDate event emitted when datetimepicker's value changes
     */
    fromDateSelected(selectedDate: Date): void{
        this.selectedToDate = selectedDate;
        this.requestData();
    }

    /**
     * Updates selectedToDate with the user's input
     * @param selectedDate event emitted when datetimepicker's value changes
     */
    toDateSelected(selectedDate: Date): void{
        this.selectedFromDate = selectedDate;
        this.requestData();
    }

    /**
     * Requests data from reading-api service between to/from datetime selections.
     */
    requestData(): void{
        this.readingApi
            .getReadingsBetween(this.selectedFromDate, this.selectedToDate)
            .subscribe(
                res => {
                    this.rawReadings = res;
                    this.chartData = this.chartUtil.generateChartDataFromReading(this.rawReadings, this.chartSeriesLabels);
                },
                err => {
                    // Report Error to the user
                    this.messages.setMessage(err);
                }
            );
    }
}
