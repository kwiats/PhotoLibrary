import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthGuard} from "../core/auth/services/auth-guard.service";
import {ToastrService} from "ngx-toastr";
import {take} from "rxjs";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

    public username: string = ''
    public isLogged: boolean = false
    menu = [
        {
            title: 'home',
            routingLink: '/home',

        },
        {
            title: 'about',
            routingLink: '/page/about',
        },


    ]

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthGuard,
                private toastrService: ToastrService) {
        if (this.authService.isLogged()) {
            this.isLogged = true
            this.loadMenu()
        } else {
            this.isLogged = false
        }
        this.username = 'admin';
    }

    isActivePage(menuUrl: string) {
        const currentUrl = this.router.url
        if (currentUrl === menuUrl) {
            return 'active'
        }
        return null
    }

    loadMenu() {
        if (this.isLogged) {
            this.menu = [
                {
                    title: 'home',
                    routingLink: '/home',
                },
                {
                    title: 'about',
                    routingLink: '/page/about',
                },
                {
                    title: 'edit',
                    routingLink: '/auth/edit/',
                }
            ]
        } else {
            this.menu = [
                {
                    title: 'home',
                    routingLink: '/home',

                },
                {
                    title: 'about',
                    routingLink: '/page/about',
                },
            ]
        }
    }

    async loggout() {
        await this.authService.logout()
        await this.router.navigate(['/', 'home'])
        this.toastrService.success('', 'Zostałeś wylogowany poprawnie ', {
            timeOut: 3000,
            progressAnimation: 'decreasing'
        });
        this.isLogged = false
        this.loadMenu()
    }
}

