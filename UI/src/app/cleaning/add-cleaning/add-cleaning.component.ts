import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Cleaning } from '@app/models/cleaning/cleaning.model';
import { CleaningApiService } from '@app/services/cleaning-api.service';
import { MessageService } from '@app/services/message.service';

@Component({
    selector: 'add-cleaning',
    templateUrl: 'add-cleaning.component.html',
    styleUrls: ['./add-cleaning.component.css']
})
export class AddCleaningComponent implements OnInit, OnDestroy{

    // Cleaning FormGroup to capture user inputs
    cleaningForm: FormGroup;

    // Slider inital values
    sliderMin: number;
    sliderMax: number;

    // Date inital value
    datetimeInitalValue: Date;

    // Slide Toggle Labels & Inital Value
    toggleLabel: string;
    toggleStrings = {
        notChanged: 'No Filter Change',
        changed: 'Filter Changed'
    };

    // Slide toggle value subscription
    toggleSub: Subscription;

    constructor(
        private cleaningApi: CleaningApiService,
        private messages: MessageService,
        private router: Router
    ){}


    ngOnInit(): void{

        // Create Reactive ngForm
        this.cleaningForm = new FormGroup({
            pct_change: new FormControl(15),
            filter_change: new FormControl(false),
        });

        // Set slider starting values
        this.sliderMin = 0;
        this.sliderMax = 100;

        // Set Date starting values
        // timestamp will be updated when datetime emits intal value
        this.datetimeInitalValue = new Date();

        // Set slide toggle intial values
        this.setToggleLabel();

        // Subscribe to model changes for label updates
        this.toggleSub = this.cleaningForm.valueChanges.subscribe(
            () => this.setToggleLabel()
        );
    }

    ngOnDestroy(): void{
       this.toggleSub.unsubscribe();
    }

    /**
     * Formats the thumblabel displayed while changing the slider value.
     * @param value - Current value of the slider
     * @returns string to display in the thumblabel
     */
    formatLabel(value: number): string{
        return value + '%';
    }

    /**
     * Calls CleaningApiSerivce to save latest cleaning data in DB.
     */
    saveCleaning(): void{
        // Format cleaning model
        const cleaning: Cleaning = {
            pct_change : this.cleaningForm.value.pct_change / (this.sliderMax - this.sliderMin),
            filter_change: this.cleaningForm.value.filter_change,
            timestamp: this.cleaningForm.value.timestamp
        };

        // Send to backend
        this.cleaningApi
            .addCleaning(cleaning)
            .pipe(take(1))
            .subscribe(
                () => { this.router.navigate(['/cleaning']); },
                err => { this.messages.setMessage(err); }
            );
    }

    /**
     * Sets slide-toggle label to match value of filter_change in cleaning model.
     */
    setToggleLabel(): void{
        // Update label to reflect toggle state
        this.toggleLabel = this.cleaningForm.value.filter_change
            ? this.toggleStrings.changed
            : this.toggleStrings.notChanged;
    }
}
