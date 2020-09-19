import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {API_URL} from '../env';
import {Temperature} from './temperature.model';

@Injectable()
export class TemperaturesApiService {
    constructor(private http: HttpClient){

    }


    getTemperatures(): Observable<Temperature[]> {
        return this.http
            .get<Temperature[]>(API_URL.concat('/temperature'))
            .pipe(
                catchError(err => {
                    return throwError(err);
                })
            );
    }

    saveReading(reading : Temperature): Observable<any> {
        // ToDo: Implement call back when flask endpoint is made available
        console.log(reading.temperature);
        return EMPTY;
    }
}
