import { Injectable } from '@angular/core';

import {ParamLabels} from '@app/models/common/label.model';

/**
 * A service which provides lables for all parameters
 */
@Injectable({
    providedIn: 'root'
})
export class LabelService{

    // Object mapping tank parameters to labels, units, icons and display types.
    private labels: ParamLabels = {

        ammonia_ppm: {
            label: 'Ammonia (NH3)',
            unit: 'ppm',
            icon: 'cached',
            type: 'number'
        },

        nitrite_ppm: {
            label: 'Nitrite (N02)',
            unit: 'ppm',
            icon: 'cached',
            type: 'number'
        },

        nitrate_ppm: {
            label: 'Nitrate (N03)',
            unit: 'ppm',
            icon: 'cached',
            type: 'number'
        },

        ph: {
            label: 'PH',
            unit: '',
            icon: 'cached',
            type: 'number'
        },

        temperature: {
            label: 'Temperature',
            unit: 'F\xB0',
            icon: 'cached',
            type: 'number'
        },

        timestamp: {
            label: '',
            unit: '',
            icon: 'access_time',
            type: 'date'
        },

        pct_change: {
            label: 'Changed',
            unit: '%',
            icon: 'waves',
            type: 'number'
        },

        filter_change: {
            label: 'Filter Change',
            unit: '',
            icon: 'eco',
            type: 'boolean'
        },

    };

    /**
     * @returns Labels for all tank information
     */
    getAllLabels(): ParamLabels{
        // Return deep copy to prevent the caller from making changes
        return JSON.parse(JSON.stringify(this.labels));
    }

    /**
     * @returns Labels for all Reading properties
     */
    getLabelSubset(desiredLabels: string[]): ParamLabels{

        // Set inital ParamLabel object to empty
        const readingLabels: ParamLabels = {};

        // Add reading labels to return value
        desiredLabels.forEach(label => {

            // Only add label is label was defined for the service
            // Assign copy to prevent caller from updating label
            if (label in this.labels){
                readingLabels[label] = Object.assign({}, this.labels[label]);
            }

        });

        // Return reading only labels
        return readingLabels;
    }
}
