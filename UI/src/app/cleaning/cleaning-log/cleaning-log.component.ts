import { Component, Input, OnInit, OnChanges, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { TIMEZONE } from '@app/env'; 
import { Cleaning } from '@app/models/cleaning/cleaning.model';


@Component({
    selector: 'cleaning-log',
    templateUrl: './cleaning-log.component.html',
    styleUrls: ['./cleaning-log.component.css']
})
/**
 * ReadingTableComponent supports a table for users to view tank reading data.
 */
export class CleaningLogComponent implements OnInit, OnChanges{

    // Table display options
    tableColumns: string[] = ['timestamp', 'pct_change', 'filter_change'];
    tablePageSize = [10, 25, 50];

    // List of all Reading objects to display
    @Input() cleaningData:Cleaning[] = [];
    displayData:MatTableDataSource<Cleaning>;

    // Paginator
    @ViewChild(MatPaginator, {static: true}) paginator:MatPaginator;

    // ng function implementations

    ngOnInit(){
        // Associate paginator with data
        if(!this.cleaningData){
            this.cleaningData = [];
        }

        this.displayData = new MatTableDataSource<Cleaning>(this.cleaningData);
        this.displayData.paginator = this.paginator;
        
    }

    ngOnChanges(){

        if(this.cleaningData && this.displayData){
             // Create deep copy of chart data
            this.displayData.data = JSON.parse(JSON.stringify(this.cleaningData));

            // Set timezone for cleaning log dates
            this.displayData.data.forEach(entry => {
                var date = entry.timestamp.toString() + "+00:00";
                entry.timestamp = new Date(date);
            });
        }
    }
}
