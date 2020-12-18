/**
 * Cleaning interface represents a singular cleaning log entry.
 */
export interface Cleaning{
    pct_change: number;
    filter_change: boolean;
    timestamp: Date;
    id?: number;
}
