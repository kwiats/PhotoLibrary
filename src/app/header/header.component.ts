import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {


    menu = [
        {
            title: 'home',
            routingLink: '/home',
            authentication: false

        },
        {
            title: 'introduce me',
            routingLink: '/page/about-me',
            authentication: false
        },

            {
                title: 'edit',
                routingLink: '/edit/',
                authentication: true
            },
    ]

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    }

    isActivePage(menuUrl: string) {
        const currentUrl = this.router.url
        if(currentUrl === menuUrl){
            return 'active'
        }
        return null
    }
}

