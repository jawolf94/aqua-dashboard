import {ChartDataSets} from 'chart.js';
import { Label } from 'ng2-charts';

/**
 * Defines a wrapper class for chart data series and labels.
 */
export interface CardChartData{
    chartDataSet: ChartDataSets[];
    chartLabels: Label[];

}
