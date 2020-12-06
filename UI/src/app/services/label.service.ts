import { Injectable } from '@angular/core';

import {Label, ParamLabels} from '@app/models/common/label.model';

/**
 * A service which provides lables for all parameters
 */
@Injectable({
    providedIn: 'root'
})
export class LabelService{

    // Object mapping tank parameters to labels, units, icons and display types. 
    labels:ParamLabels = {

        ammonia_ppm: {
            label: "Ammonia (NH3)",
            unit: "ppm",
            icon: "cached",
            type: "number"
        },
    
        nitrite_ppm: {
            label: "Nitrite (N02)",
            unit: "ppm",
            icon: "cached",
            type: "number"
        },
    
        nitrate_ppm: {
            label: "Nitrate (N03)",
            unit: "ppm",
            icon: "cached",
            type: "number"
        }, 
    
        ph: {
            label: "PH",
            unit: "",
            icon: "cached",
            type: "number"
        },
    
        temperature: {
            label: "Temperature",
            unit: "F\xB0",
            icon: "cached",
            type: "number"
        },

        timestamp:{
            label: "",
            unit: "",
            icon: "access_time",
            type: "date"
        },

        pct_change:{
            label: "Changed",
            unit: "%",
            icon: "waves",
            type: "number"
        },

        filter_change:{
            label: "Filter Change",
            unit: "",
            icon: "eco",
            type: "boolean"
        },

    }

    /**
     * @returns Labels for all tank paramters
     */
    getAllLabels():ParamLabels{
        return this.labels;
    }
}