import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Cleaning } from '@app/models/cleaning/cleaning.model';
import { ParamLabels } from '@app/models/common/label.model';
import { LayoutOptions } from '@app/models/common/layout-options.model';
import { BreakpointService } from '@app/services/breakpoint.service';
import { CleaningApiService } from '@app/services/cleaning-api.service';
import { LabelService } from '@app/services/label.service';
import { MessageService } from '@app/services/message.service';

@Component({
    selector: 'cleaning-view',
    templateUrl: './cleaning-view.component.html',
    styleUrls: ['./cleaning-view.component.css']
})
export class CleaningViewComponent implements OnInit, OnDestroy{

    // overview-card labels for each cleaning value
    displayedCards: string[] = ['pct_change', 'filter_change', 'timestamp'];
    cardLabels: ParamLabels;

    // BreakpointService subscription and latest layout options
    breakpointSubscription: Subscription;
    layout: LayoutOptions;

    // Cleaning log data
    cleaningSub: Subscription;
    allCleaningLogs: Cleaning[];
    latestCleaning: Cleaning;

    // Constructor and ng method implmentations

    constructor(
        private breakpointService: BreakpointService,
        private cleaningApi: CleaningApiService,
        private labelService: LabelService,
        private messages: MessageService
    ){}

    ngOnInit(): void{

        // Subscribe to breakpoint service
        this.breakpointSubscription = this.breakpointService
            .getLayoutOptions()
            .subscribe(
                res => {
                    // Set latest layout on success
                    this.layout = res;
                },
                err => {
                    // Log error to console on failure
                    console.error(err);
                }
            );

        // Get labels for overview cards
        this.cardLabels = this.labelService.getLabelSubset(this.displayedCards);

        // Initalize cleaning data
        this.allCleaningLogs = [];
        this.latestCleaning = null;

        // Retrieve latest cleaning logs
        this.cleaningSub = this.cleaningApi.getCleanings()
            .subscribe(
                res => {
                    // Set Component instance vars
                    this.allCleaningLogs = res;
                    this.setLatestCleaning();
                },
                err => {
                    // Display error message to the user
                    this.messages.setMessage(err);

                    // Ensure cleaning log is set to empty set of data
                    this.allCleaningLogs = [];
                }
            );
    }

    ngOnDestroy(): void{
        this.breakpointSubscription.unsubscribe();
        this.cleaningSub.unsubscribe();
    }

    /**
     * Sets latestCleaning from allCleaningLogs
     */
    setLatestCleaning(): void{
        // Check if allCleaningLogs has data
        if (this.allCleaningLogs && this.allCleaningLogs.length > 0){
            // Set latest cleaning. Data is guaranteed in desc timestamp order.
            this.latestCleaning = this.allCleaningLogs[0];
        }
    }

}
