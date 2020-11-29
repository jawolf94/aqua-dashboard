import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageService } from 'src/app/services/message.service';

@Component({
    selector:"message-banner",
    templateUrl: "./message-banner.component.html",
    styleUrls: ["./message-banner.component.css"]
})
export class  MessageComponent implements OnInit{
    
    // Subscription to message service
    messageSub:Subscription;

    // Message to display
    message:string;

    // Angular function definitions
    constructor(private messages:MessageService){}

    ngOnInit(){
        // Subscribe to message service to display new alerts
        this.messageSub = this.messages.onMessage()
            .subscribe(
                res=> {this.message = res;},
                err=> {console.error(err)}
            )
    }

    close(){
        // Clear the current message which hides the div.
        // Banner will reappear when new message is provided by the message service
        this.message="";
    }

}