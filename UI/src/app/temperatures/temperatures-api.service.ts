import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from '@rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from '../env';
import {Temperature} from './temperature.model';

@Injectable()
export class TemperaturesApiService {
    constructor(private http: HttpClient){

    }

    private static _handleError(err: HttpErrorResponse | any){
        return Observable.throw(err.message || 'Error: Unable to complete request.');
    }

    getTemperatures(): Observable<Temperature[]> {
        return this.http
            .get('${API_URL}/temperatures')
            .catch(TemperaturesApiService._handleError);
    }
}
