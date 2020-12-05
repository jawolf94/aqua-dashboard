/**
 * Represents a set of LayoutOptions for both Mobile & Desktop Layouts
 */
export interface DeviceLayouts{
    desktop: LayoutOptions,
    mobile: LayoutOptions   
}

/**
 * Represents options for common view features
 */
export interface LayoutOptions{
    overviewCards: OverviewCardOptions  
    chartCards: ChartCardOptions
    datepickerCards: OverviewCardOptions;
}

/**
* Represents layout options for Card Charts
*/
export interface ChartCardOptions{
   sampling: number,
   pointSize: number,
   pointRadius: number
}

/**
 * Represents layout options for Informational Overview Cards
 */
export interface OverviewCardOptions{
        columns: number,
        rowHeight: string,
        col_span?: number,
        row_span?: number,
}