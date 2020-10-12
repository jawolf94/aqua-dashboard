import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';

import {Reading} from '../models/reading.model'
import {ReadingApiService} from '../reading-api.service';

@Component({
    selector: 'reading-table',
    templateUrl: './reading-table.component.html'
})
/**
 * ReadingTableComponent supports a table for users to view tank reading data.
 */
export class ReadingTableComponent implements OnInit, OnDestroy{

    // Subscription to ReadingApiService Obervable
    readingListSub: Subscription;

    // List of all Reading objects to display
    readingList: Reading[];

    // Columns for the table to display
    displayedColumns: string[] = ['id','timestamp', 'ammonia_ppm', 'nitrite_ppm', 'nitrate_ppm','ph', 'temperature', 'manual'];

    constructor(private ReadingApi: ReadingApiService){}

    /**
     * Calls getAllReadings() from ApiService to get all tank readings.
     * Sets readingList on success.
     */
    ngOnInit(){
        this.readingListSub = this.ReadingApi
            .getAllReadings()
            .subscribe(
                res => {this.readingList = res;},
                err => {console.log(err); }
            )
    }

    /**
     * Unsubscribes readingListSub from Obeservable
     */
    ngOnDestroy(){
        this.readingListSub.unsubscribe();
    }
}
