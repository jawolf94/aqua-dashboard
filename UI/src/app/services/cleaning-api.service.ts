import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_URL } from '@app/env';
import { Cleaning } from '@app/models/cleaning/cleaning.model';
import { ServiceUtil } from '@app/services/service-util.service';

@Injectable({
    providedIn: 'root'
})
export class CleaningApiService{

    constructor(private httpClient: HttpClient, private utils: ServiceUtil){}

    /**
     * Posts a new cleaning log entry to the Flask API
     * @param cleaningLog - New cleaning log entry to Post
     * @return Any type observable representing response this call
     */
    addCleaning(cleaningLog: Cleaning): Observable<any>{
        return this.httpClient
            .post(`${API_URL}/cleaning/add-cleaning`, cleaningLog)
            .pipe(
            catchError(this.utils.handleError)
            );
    }

    /**
     * Requests all cleaning log entires from FLASK API.
     * @returns Cleaning[] type Observable representing all cleaning log entries.
     *      Data is returned in descending time order from API
     */
    getCleanings(): Observable<Cleaning[]>{
        return this.httpClient
            .get<Cleaning[]>(`${API_URL}/cleaning/get-cleanings`)
            .pipe(
                catchError(this.utils.handleError)
            );
    }
}
