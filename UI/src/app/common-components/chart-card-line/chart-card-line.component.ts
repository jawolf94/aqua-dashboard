import { Component, Input, OnChanges, ViewChild} from '@angular/core';

import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';

import { CardChartData } from '@app/models/common/card-chart-data.model';

/**
 * A component used to generate line charts for display in other views.
 */
@Component({
  selector: 'chart-card-line',
  templateUrl: './chart-card-line.component.html',
  styleUrls: ['./chart-card-line.component.css']
})
export class ChartCardLineComponent implements OnChanges {

    // Data and Labels displayed on the chart
    @Input() chartData: CardChartData;   

    // Copy of chart data to prevent destruction of origional set during sampling
    private displayChartData:CardChartData;

    // The number of data points displayed in the chart
    // The higher the number is, the less points will be displayed
    // i.e sampling = 2 equates to every other data point being displayed
    // Default is 1 so that all data will display.
    @Input() sampling: number = 1;

    // Caller defiend chart options

    // Array defining the color of the data series displayed 
    @Input() lineColors: Color[]; 

    // Space around point which can be clicked/tapped to display annotation
    @Input() pointHitRadius: number = 1;

    // Size of the data point on the chart
    @Input() pointRadius:number = 3;

    // Static Chart Options
    chartType: ChartType = 'line'
    chartOptions: ChartOptions= {
        responsive: true,
        maintainAspectRatio: false,
    }

    // Directive used to sepcify canvas element which renders the chart
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;


    ngOnChanges(){

        // Get hidden status of all current sets
        var hidden:Map<string, boolean> = this.getHiddenStatuses();

        // Create deep copy of chart data to preserve origional data set.
        this.displayChartData = JSON.parse(JSON.stringify(this.chartData)); 
        
        // Sample & Set new data if passed in
        if(this.hasInputData()){

            // Reduce data set size
           this.sampleChartData(hidden);
           this.sampleChartLabels();
        }

    }

    /**
     * Samples chart data to create a reduced data set size based on specified sampling
     */
    sampleChartData(statuses:Map<string, boolean>){

         // Reduce the size of each data set in chartData
         this.displayChartData.chartDataSet.forEach(set => {
            // Create a new empty data set
            var reducedSet = [];

            // Add data point to new set if index is divisble by sampling
            for(let [index, point] of set.data.entries()){
                if(index % this.sampling === 0){
                   reducedSet.push(point);
                }
            }

            // Set the reduced set to be the new data in this set
            set.data = reducedSet;

            // Set point display options
            set.pointRadius = this.pointRadius;
            set.pointHitRadius = this.pointHitRadius;

            // Set dataset visibility to previous state - display if state is not specifed.
            set.hidden =  statuses.has(set?.label) ?
               statuses.get(set.label)
               : false;
        });
    }

    /**
     * Reduces the size of x-axis labels based on specified sampling
     */
    sampleChartLabels(){

        // Reduce Labels based on sampling specified
        var reducedLabels:Label[] = [];
        for(let [index, label] of this.displayChartData.chartLabels.entries()){

            // Add label to reduced set 
            if(index % this.sampling === 0){
                reducedLabels.push(label);
            }
        }

        // Set reduced set to chart's labels
        this.displayChartData.chartLabels = reducedLabels;
    }

    /**
     * Checks if a data set and labels have been set in displayChartData.
     * @returns - True if labels and data set are available for display.
     */
    hasInputData(): Boolean{
        return this.chartData
            && (this.chartData.chartDataSet && this.chartData.chartDataSet.length > 0)
            && (this.chartData.chartLabels && this.chartData.chartLabels.length > 0);
    }


    /**
     * Creates a mapping of set labels to their hidden state (T/F or Null)
     * @returns Map of label to current hidden state 
     */
    getHiddenStatuses():Map<string, boolean>{

        // Create empty array of type LooseObject
        var sets:Map<string, boolean> = new Map();

        // If the chart has data sets
        if(this.chart && this.chart.datasets){
            
            // Map all the dataset labels to create an array of labels
            const labels = this.chart.datasets.map(set => set?.label );

            // Loop through each label to create label/hidden mappings
            labels.forEach((label, index) => {

                // Set each objects label to current hidden status
                // Index in mapped array is same index in dataset array
                 let hidden = this.chart.isDatasetHidden(index) !== null ? 
                    this.chart.isDatasetHidden(index)
                    : this.chart.datasets[index].hidden;

                sets.set(label, hidden);

            });
        }

        return sets;
    }
}
