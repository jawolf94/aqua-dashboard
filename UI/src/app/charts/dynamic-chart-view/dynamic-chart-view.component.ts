import { Component, OnInit} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

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

    // Possible Data Display Options
    displayOptionStates = {
        "ammonia_ppm": {
            "label": "Ammonia (NH3)",
            "checked": false
        },
    
        "nitrite_ppm": {
            "label": "Nitrite (N02)",
            "checked": false
        },
    
        "nitrate_ppm": {
            "label": "Nitrate (N03)",
            "checked": false
        }, 
    
        "ph": {
            "label": "PH",
            "checked": false
        },
    
        "temperature": {
            "label": "Temperature (F\xB0)",
            "checked": false
        },
    }

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

    /**
     * Updates displayOptionsState with state of checkboxes (checked/unchecked)
     * @param label - The label of the corresponding state option
     * @param event - event emitted when checkbox is selected
     */
    updateCheckedValue(label: string, event: MatCheckboxChange){
        this.displayOptionStates[label]["checked"] = event.checked;
    }


    // Getters for display

    /**
     * Gets keys from displayOptionStates object
     */
    get displayOptions(){
        return Object.keys(this.displayOptionStates);
    }
}
