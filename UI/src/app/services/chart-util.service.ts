import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

import { ChartDataSets } from 'chart.js';

import { TIMEZONE } from '@app/env';
import { CardChartData } from '@app/models/common/card-chart-data.model';
import { Reading } from '@app/models/reading/reading.model';

/**
 * Service to provide common functions used when creating charts.
 */
@Injectable({
    providedIn:'root'
})
export class ChartUtilService{

    generateChartDataFromReading(readings:Reading[], setLabels:Map<string, string>){

        // Create inital CardCharData object
        var data:CardChartData = {
            chartDataSet:[],
            chartLabels:[]
        }

        // Check if readings & set labels were provided
        if(!readings || readings.length <= 1 || !setLabels || setLabels.size <= 0){

            // Return empty chart data if lables or readings are not provided
            return data;
        }

        // Generate Data Series
       for(let [param, paramLabel] of setLabels.entries()){  
            // Create a new series for the display option
            var series:ChartDataSets = {
                label: paramLabel,
                data:[]
            }
            
            // Add data points from Reading matching display option
            readings.forEach(reading => {
                series.data.push(reading[param]);
            });

            // Push completed series into data
            data.chartDataSet.push(series);
        }

        //Generate Chart Labels
        data.chartLabels = readings.map((obj) => {
            return formatDate(
                obj['timestamp'].toString() + TIMEZONE,
                'M/d/yy, HH:mm',
                'en-US')
        });

        // Return completed CardShartData with series and labels
        return data;
    }

}