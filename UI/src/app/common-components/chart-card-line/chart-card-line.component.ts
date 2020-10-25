import { Component, Input } from '@angular/core';

/**
 * Displays a line chart using the data provided as inputs
 */
@Component({
    selector:'chart-card-line',
    templateUrl: './chart-card-line.component.html',
    styleUrls: ['../../app.component.css', './chart-card-line.component.css']
})
export class ChartCardLineComponent{
    
    // Sample Data for ngx-chart
    @Input() public lineChartData;

    // Chart color scheme options
    @Input() colorScheme: string;
    @Input() colorSchemeType: string = "ordinal";

    // Chart legend options
    @Input() showLegend: Boolean = false;
    @Input() legendPosition: string = "right";
    @Input() legendTitle: string = "Legend";

    // Chart Axis Options
    @Input() showXAxis: Boolean = false;
    @Input() showXLabel: Boolean = false;
    @Input() xLabel: string = "X-Axis";

    @Input() showYAxis: Boolean = false;
    @Input() showYLabel: Boolean = false;
    @Input() yLabel: string = "Y-Axis";

    // Grid Lines 
    @Input() showGridLines: Boolean = true;



}