import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class ServiceUtil{

    /**
     * Logs error to the console and returns a user fiendly error message.
     * @param error - The error thrown during an http request.
     * 
     * @returns Observable representing user friendly error message
     */
    handleError(error:HttpErrorResponse): Observable<never>{

        // Create a simple message for the caller
        var message:string = "Error: An unknown error occurred. Please retry your request."

        // Check if backend failed without returning a code
        if(error.status === 0 || error.error.exception === undefined || error.error.message === undefined){
            // If backend did not provide a stack trace log the error
            console.error(error.error);
        }
        else{
            // If the backend did return an error code - print exception to console
            console.error(error.error.exception);

            // Get simple message to display from backend
            message = error.error.message;
        }

        // Throw error with message
        return throwError(message);
    }
}