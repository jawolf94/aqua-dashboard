import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

/**
 * A simple message service which is capable of passing/storing one message at a time.
 */
@Injectable({
    providedIn: 'root'
})
export class MessageService{

    // Subject used to communicate with subscribers
    private subject: Subject<string> = new Subject<string>();

    /**
     * Returns an Observable representing the service's message
     */
    onMessage(): Observable<string>{
        return this.subject.asObservable();
    }

    /**
     * Sets a new message and alerts subscribers of the change.
     * @param newMessage - New message to send.
     */
    setMessage(newMessage: string): void{
        this.subject.next(newMessage);
    }
}
