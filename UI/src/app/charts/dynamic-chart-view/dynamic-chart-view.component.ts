import { Component, OnInit} from '@angular/core';

@Component({
    selector: 'dynamic-chart-view',
    templateUrl: './dynamic-chart-view.component.html',
    styleUrls: ['./dynamic-chart-view.component.css']
})
export class DynamicChartViewComponent implements OnInit{

    // Default control options
    tomorrowDate:Date;

    // Datetimes selected by the user     
    selectedToDate: Date;
    selectedFromDate:Date;

    ngOnInit(){
        // Set tomorrow's date for default control set-up
        this.tomorrowDate = new Date();
        this.tomorrowDate.setDate(this.tomorrowDate.getDate() + 1)
        
        // Reset time to 0 hours, minutes, seconds
        this.tomorrowDate.setHours(0,0,0,0);
    }

    /**
     * Updates selectedFromDate with the user's input
     * @param selectedDate event emitted when datetimepicker's value changes
     */
    fromDateSelected(selectedDate:Date){
        this.selectedToDate = selectedDate
    }

    /**
     * Updates selectedToDate with the user's input
     * @param selectedDate event emitted when datetimepicker's value changes
     */
    toDateSelected(selectedDate:Date){
        this.selectedFromDate = selectedDate;
    }
}
