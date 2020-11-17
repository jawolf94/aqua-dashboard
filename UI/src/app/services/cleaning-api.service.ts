import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../env';
import { Cleaning } from '../models/cleaning/cleaning.model';

@Injectable({
    providedIn: 'root'
})
export class CleaningApiService{

    constructor(private httpClient:HttpClient){}

    /**
     * Posts a new cleaning log entry to the Flask API
     * @param cleaningLog - New cleaning log entry to Post
     * @return Any time observable representing response this call
     */
    addCleaning(cleaningLog:Cleaning): Observable<any>{
        return this.httpClient
        .post(`${API_URL}/cleaning/add-cleaning`, cleaningLog);
    }
}