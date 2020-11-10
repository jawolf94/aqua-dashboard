import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable} from 'rxjs';
import { catchError} from 'rxjs/operators';

import { API_URL } from '../env';
import { DateTimeModel } from '../models/common/datetime.model'
import { ParameterStatus } from 'src/app/models/reading/parameter_status.model';
import { Reading } from 'src/app/models/reading/reading.model';

/**
 * Service which performs GET and POST opperations to Tank Reading APIs
 */
@Injectable({
    providedIn: 'root'
})
export class ReadingApiService{

    constructor(private httpClient: HttpClient){}

    /**
     * @returns Observable<Reading> which represents latest reading from tank.
     */
    getLatestReading(): Observable<Reading>{
        return this.httpClient
            .get<Reading>(`${API_URL}/latest-reading`)
            .pipe(
                catchError(
                    err => {
                        console.log(err.message);
                        return new Observable<Reading>();
                    }
                )
            )
    }

    /**
     * @returns Observable<Reading[]> which represents list of all tank readings.
     */
    getAllReadings(): Observable<Reading[]>{
        return this.httpClient
            .get<Reading[]>(`${API_URL}/all-readings`)
            .pipe(
                catchError(
                    err => {
                        console.log(err.message);
                        return new Observable<Reading[]>();
                    }
                )
            );
    }

    /**
     * Requests readings between the start and end time specified.
     * @param start - Datetime. The earliest readings to
     * @param end 
     * @returns
     */
    getReadingsBetween(start:Date, end?:Date): Observable<Reading[]>{

        // Create Datetime models for request
        var requestParams:HttpParams = new HttpParams()
            .set(
                'start', 
                JSON.stringify(
                    { datetime: start } as DateTimeModel
                )
            );

        if(end){
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
           
    }

    /**
     * @param reading ParamaterStatus object with ID set to desired reading to check. 
     * @returns Observable<ParameterStatus> which represents the status of an invdivdual reading. 
     */
    checkParameterStatus(reading: ParameterStatus): Observable<ParameterStatus>{
        return this.httpClient
            .post<ParameterStatus>(`${API_URL}/check-parameter-status`, reading)
            .pipe(
                catchError(
                    err=> {
                        console.log(err.message);
                        return new Observable<ParameterStatus>();
                    }
                )
            );
    }

    /**
     * Calls /save-manual-reading endpoint to save Reading.
     * @param reading - The Reading model to be saved.
     */
    saveManualReading(reading: Reading): Observable<any>{
        return this.httpClient
            .post(`${API_URL}/save-manual-reading`, reading);
    }
}
