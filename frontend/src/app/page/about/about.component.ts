import {Component} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    constructor(private toastrService: ToastrService) {
    }

    sendMessage() {
        this.toastrService.warning(
            'Formularz jest trakcie budowania..', 'Błąd podczas wysyłania wiadomosci', {
                timeOut: 3000,
                progressAnimation: 'decreasing'
            });
    }

}
