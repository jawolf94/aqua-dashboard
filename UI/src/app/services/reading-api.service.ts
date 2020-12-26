import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import { catchError} from 'rxjs/operators';

import { API_URL } from '@app/env';
import { DateTimeModel } from '@app/models/common/datetime.model';
import { ParameterStatus } from '@app/models/reading/parameter_status.model';
import { Reading } from '@app/models/reading/reading.model';
import { ServiceUtil } from '@app/services/service-util.service';

/**
 * Service which performs GET and POST opperations to Tank Reading APIs
 */
@Injectable({
    providedIn: 'root'
})
export class ReadingApiService{

    constructor(private httpClient: HttpClient, private utils: ServiceUtil){}

    /**
     * @returns Observable<Reading> which represents latest reading from tank.
     */
    getLatestReading(): Observable<Reading>{
        return this.httpClient
            .get<Reading>(`${API_URL}/latest-reading`)
            .pipe(
                catchError(this.utils.handleError)
            );
    }

    /**
     * @returns Observable<Reading[]> which represents list of all tank readings.
     */
    getAllReadings(): Observable<Reading[]>{
        return this.httpClient
            .get<Reading[]>(`${API_URL}/all-readings`)
            .pipe(
                catchError(this.utils.handleError)
            );
    }

    /**
     * Requests readings between the start and end time specified.
     * @param start - Datetime. The earliest readings to retrieve
     * @param end - Datetime. The latest readings to retrieve. Gets all readings after start if not passed.
     * @returns - Observable representing a list of readings between specified times.
     */
    getReadingsBetween(start: Date, end?: Date): Observable<Reading[]>{

        // Create Datetime models for request
        // All dates are serialized from local time to UTC time
        // Flask API will deserialize a UTC datetime as expected.
        let requestParams: HttpParams = new HttpParams()
            .set(
                'start',
                JSON.stringify(
                    { datetime: start } as DateTimeModel
                )
            );

        if (end){
            // Set end param if passed in.
            requestParams = requestParams
                .set(
                    'end',
                    JSON.stringify(
                        { datetime: end } as DateTimeModel
                    )
                );
        }

        // Request and return Observable
        return this.httpClient
            .get<Reading[]>(`${API_URL}/readings-between`, {params: requestParams})
            .pipe(
                catchError(this.utils.handleError)
            );

    }

    /**
     * @param reading ParamaterStatus object with ID set to desired reading to check.
     * @returns Observable<ParameterStatus> which represents the status of an invdivdual reading.
     */
    checkParameterStatus(readingID: number): Observable<ParameterStatus>{

        // Send the request
        return this.httpClient
            .get<ParameterStatus>(`${API_URL}/check-parameter-status/${readingID.toString()}`)
            .pipe(
                catchError(this.utils.handleError)
            );
    }

    /**
     * Calls /save-manual-reading endpoint to save Reading.
     * @param reading - The Reading model to be saved.
     */
    saveManualReading(reading: Reading): Observable<any>{
        return this.httpClient
            .post(`${API_URL}/save-manual-reading`, reading)
            .pipe(
                catchError(this.utils.handleError)
            );
    }
}
