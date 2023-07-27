import {Injectable} from "@angular/core";
import jwt_decode from "jwt-decode";
import {AuthService} from "./auth.service";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";


@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    refreshInterval: any = null;
    // @ts-ignore
    userAction$: BehaviorSubject<string> = new BehaviorSubject<string>(null);


    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate(): boolean {
        const access = window.localStorage.getItem('access');
        const refresh = window.localStorage.getItem('refresh');
        if (!access) {
            this.router.navigate(['/', 'auth', 'login']);
            return false;
        } else {
            const accessObject = JSON.parse(access);
            const jwtContent = jwt_decode(accessObject.idToken || accessObject);
            // @ts-ignore
            const isExpired = jwtContent.exp < (new Date().getTime() / 1000);
            if (!isExpired && refresh) {
                // @ts-ignore
                const secondsLeft = jwtContent.exp - (new Date().getTime() / 1000) - 30;
                this.setUpdate(JSON.parse(refresh), secondsLeft * 1000);
            }
            return !isExpired;
        }
    }

    isLogged(): boolean {
        const access = window.localStorage.getItem('access');
        const refresh = window.localStorage.getItem('refresh');
        if (access) {
            const accessObject = JSON.parse(access);
            const jwtContent = jwt_decode(accessObject.idToken || accessObject);

            // @ts-ignore
            const isExpired = jwtContent.exp < (new Date().getTime() / 1000);
            if (!isExpired && refresh) {
                // @ts-ignore
                const secondsLeft = jwtContent.exp - (new Date().getTime() / 1000) - 30;
                this.setUpdate(JSON.parse(refresh), secondsLeft * 1000);
            }
            return true;
        }
        return false
    }

    setUpdate(token: string, time: number): void {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.refreshInterval = setTimeout(() => {
            this.authService.refreshToken(token)
                .subscribe(res => {
                    this.signInUser(res.access, res.refresh);
                })
            // @ts-ignore
        }, time);
    }

    signInUser(content: any, refresh: any = null): void {
        window.localStorage.setItem('access', JSON.stringify(content));
        if (refresh) {
            const jwtContent = jwt_decode(content.idToken || content);
            // @ts-ignore
            const secondsLeft = jwtContent.exp - (new Date().getTime() / 1000) - 30;
            this.setUpdate(refresh, secondsLeft * 1000);
            window.localStorage.setItem('refresh', JSON.stringify(refresh));
        }
    }

    logout(): void {
        window.localStorage.removeItem('access');
        window.localStorage.removeItem('refresh');
        window.localStorage.removeItem('login');
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.userAction$.next('logout');
    }
}