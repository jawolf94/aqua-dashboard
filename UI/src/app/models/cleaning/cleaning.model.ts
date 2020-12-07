/**
 * Cleaning interface represents a singular cleaning log entry.
 */
export interface Cleaning{
    pct_change:number;
    filter_change:Boolean;
    timestamp:Date;
    id?:number;
}