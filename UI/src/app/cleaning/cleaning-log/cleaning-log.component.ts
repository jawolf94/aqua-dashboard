import { Component, Input, OnChanges} from '@angular/core';

import { Cleaning } from 'src/app/models/cleaning/cleaning.model';
import { TIMEZONE } from 'src/app/env'; 


@Component({
    selector: 'cleaning-log',
    templateUrl: './cleaning-log.component.html',
    styleUrls: ['./cleaning-log.component.css']
})
/**
 * ReadingTableComponent supports a table for users to view tank reading data.
 */
export class CleaningLogComponent implements OnChanges{

    // Table display options
    tableColumns: string[] = ['timestamp', 'pct_change', 'filter_change'];
    tablePageSize = [10, 25, 50];

    // List of all Reading objects to display
    @Input() cleaningData:Cleaning[] = [];
    displayData:Cleaning[] = [];

    // ng function implementations

    ngOnChanges(){
        // Create deep copy of chart data
        this.displayData = JSON.parse(JSON.stringify(this.cleaningData));

        // Set timezone for cleaning log dates
        this.displayData.forEach(entry => {
            var date = entry.timestamp.toString() + "+00:00";
            entry.timestamp = new Date(date);
        });
    }
}
