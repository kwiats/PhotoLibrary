import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../core/auth/services/auth.service";
import {AuthGuard} from "../core/auth/services/auth-guard.service";

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
    login: string = '';
    password: string = '';
    loginFocus = false;
    passwordFocus = false;

    constructor(
        private authService: AuthService,
        private authGuard: AuthGuard,
        private router: Router) {

    }

    ngOnInit(): void {
        if (window.localStorage.getItem('login')) {
            // @ts-ignore
            this.login = window.localStorage.getItem('login');
            // @ts-ignore
            this.password = window.localStorage.getItem('password');
            this.doLogin();
        } else {
            this.authGuard.logout();
        }
    }

    get isValid(): boolean {
        return this.login !== '' && this.password !== '';
    }

    doLogin() {
        if (this.isValid) {
            this.authService.login(
                this.login,
                this.password)
                .subscribe(async (result) => {
                    this.authGuard.signInUser(result.access, result.refresh);
                    await this.router.navigate(['/', 'home']);
                })
        }
    }


}
