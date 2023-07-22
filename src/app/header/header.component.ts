import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../core/auth/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent {


    menu = [
        {
            title: 'introduce me',
            routingLink: '/page/about-me',
            authentication: false
        },
        {
            title: 'my photos',
            routingLink: '/home',
            authentication: false

        },
        {
            title: 'edit',
            routingLink: '/edit/',
            authentication: true
        },
    ]

    constructor(private router: Router) {
    }

}

