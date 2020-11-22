import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
    selector: 'cleaning-log',
    templateUrl: './cleaning-log.component.html',
    styleUrls: ['./cleaning-log.component.css']
})
/**
 * ReadingTableComponent supports a table for users to view tank reading data.
 */
export class CleaningLogComponent implements OnInit, OnDestroy{

    // Table display options
    tableColumns: string[] = ['timestamp', 'pct_change', 'filter_change'];
    tablePageSize = [10, 25, 50];

    // Subscription to ReadingApiService Obervable
    readingListSub: Subscription;

    // List of all Reading objects to display
    cleaningLog:[];

    constructor(){}

    /**
     * Calls <Service> from ApiService to get all tank readings.
     * Sets readingList on success.
     */
    ngOnInit(){
        // ToDo: Subscribe to cleaning log API
    }

    /**
     * Unsubscribes readingListSub from Obeservable
     */
    ngOnDestroy(){
        // ToDo: Unsubscribe from cleaning log Obervable
    }
}
