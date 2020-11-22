import { Component } from '@angular/core';

@Component({
    selector: 'cleaning-view',
    templateUrl: './cleaning-view.component.html',
    styleUrls: ['./cleaning-view.component.css']
})
export class CleaningViewComponent{
    cardLabels = {
        "pct_change":{
            "label": "Changed",
            "unit": "%",
            "icon": "waves"
        },
        "filter_change":{
            "label": "Filter Change",
            "unit": "",
            "icon": "eco"
        },
        "timestamp":{
            "label": "",
            "unit": "",
            "icon": "access_time"
        }
    }

    /**
     * Returns keys in cardLabels for use in html
     */
    get allCardLabels(){
        return Object.keys(this.cardLabels);
    }
}
