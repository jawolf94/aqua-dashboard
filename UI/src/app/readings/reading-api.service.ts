import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable} from 'rxjs';
import { catchError} from 'rxjs/operators';

import {Reading} from './reading.model';
import {API_URL} from '../env';

/**
 * Service which performs GET and POST opperations to Tank Reading APIs
 */
@Injectable()
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
            )
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
