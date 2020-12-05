import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

import { DeviceLayouts, LayoutOptions } from '@app/models/common/layout-options.model';
import { Observable, BehaviorSubject } from 'rxjs';


/**
 * A service to provide page layout infromation based on the screen size.
 */
@Injectable({
    providedIn: 'root'
})
export class BreakpointService{

    // Defines layouts for Desktop and Mobile views for the app
    layoutOptions:DeviceLayouts = {
        desktop: {
            overviewCards: {
                columns: 3,
                col_span: 1,
                rowHeight: '215px',
                row_span: 1,
            },

            chartCards: {
                sampling: 1,
                pointSize: 4,
                pointRadius: 3
            },

            datepickerCards: {
                columns: 2,
                rowHeight: '225px',
            }
        },

        mobile: {
            overviewCards: {
                columns: 1,
                rowHeight: '215px',
                col_span: 1,
                row_span: 1
            },
            chartCards: {
                sampling: 4,
                pointSize: 4,
                pointRadius: 3
            },

            datepickerCards: {
                columns: 1,
                rowHeight: '225px',
            }
        }
    }

    // Layout matching the current breakpoint
    selectedLayout:BehaviorSubject<LayoutOptions>;    


    constructor(private breakpointObserver:BreakpointObserver){

        // Subscribe to changes in the window size
        this.breakpointObserver
            .observe(Breakpoints.Handset)
            .subscribe(
                res => {
                    // Prevent updates to selected layout before constructor completes
                    if(this.selectedLayout){

                        // Update layout options based on returned bp state
                        this.updateLayoutOptions(res);
                    }       
                },
                err => {
                    // Log errors to the console if observable fails
                    console.error(err);
                }
            )

        // Create BehaviorSubject with inital value set to the current screen size
        if(this.breakpointObserver.isMatched(Breakpoints.Handset)){

            // Set inital layout options for mobile
            this.selectedLayout = new BehaviorSubject<LayoutOptions>(this.layoutOptions.mobile)
        }
        else{

            // Set inital layout options for desktop
            this.selectedLayout = new BehaviorSubject<LayoutOptions>(this.layoutOptions.desktop);
        }
    }

    /**
     * @returns An observable representing the current layout configuration based on screen size.
     */
    getLayoutOptions():Observable<LayoutOptions>{
        return this.selectedLayout.asObservable();
    }

    /**
     * Sets selected layout options based on current screensize
     * @param state - BreakpointState used to determine layout options
     */
    private updateLayoutOptions(state:BreakpointState){

        // Set state to Mobile if matches - otherwise Desktop
        var newLayout:LayoutOptions = state.matches ?
            this.layoutOptions.mobile
            : this.layoutOptions.desktop;

        // Pass new value to Subject for all subscribers
        this.selectedLayout.next(newLayout);
    }

}