import {Injectable} from "@angular/core";
import jwt_decode from "jwt-decode";
import {AuthService} from "./auth.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpService} from "../../common/services/http.service";


@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    refreshInterval: any = null;
    // @ts-ignore
    userAction$: BehaviorSubject<string> = new BehaviorSubject<string>(null);


    constructor(private authService: AuthService,
                private router: Router,
                private httpService: HttpService) {
    }

    async canActivate(): Promise<boolean> {
        return new Promise((resolve) => {
            this.getAuthToken()
                .then(res => {
                    if (res) {
                        this.getRefreshToken()
                            .then(refresh => {
                                const jwtContent: any = jwt_decode(res)
                                const isExpired = jwtContent.exp < (new Date().getTime() / 1000);

                                if (!isExpired) {
                                    if (refresh) {
                                        const secondsLeft = jwtContent.exp - (new Date().getTime() / 1000) - 30;
                                        this.setUpdate(refresh, secondsLeft);
                                    }
                                    resolve(true);
                                } else {
                                    if (refresh) {
                                        const refreshContent: any = jwt_decode(refresh);
                                        const isRefreshExpired = refreshContent.exp < (new Date().getTime() / 1000);
                                        if (isRefreshExpired) {
                                            resolve(false);
                                        } else {
                                            this.refreshToken(refresh)
                                                .subscribe((data) => {
                                                    this.setTokens(data)
                                                        .then(() => resolve(true))
                                                        .catch(() => resolve(false));
                                                }, () => resolve(false))
                                        }
                                    } else {
                                        resolve(false);
                                    }
                                }
                            })
                    } else {
                        this.router.navigate(['/', 'auth', 'login']);
                        resolve(false);
                    }
                })
        })
    }

    async getAuthToken(): Promise<string | null> {
        return new Promise((resolve) => {
            const accessToken = localStorage.getItem('access');
            if (accessToken) {
                try {
                    const tokenData = jwt_decode<Record<string, unknown>>(accessToken);
                    // @ts-ignore
                    if (tokenData.exp >= Date.now() / 1000) {
                        console.log()
                        resolve(accessToken);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }

    async getRefreshToken(): Promise<string | null> {
        return new Promise((resolve) => {
            const accessToken = localStorage.getItem('refresh');
            if (accessToken) {
                try {
                    const tokenData = jwt_decode<Record<string, unknown>>(accessToken);
                    // @ts-ignore
                    if (tokenData.exp >= Date.now() / 1000) {
                        console.log()
                        resolve(accessToken);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }

    setTokens(data: any): Promise<void> {
        return new Promise(resolve => {
            Promise.all([
                window.localStorage.setItem('access', JSON.stringify(data.access)),
                window.localStorage.setItem('refresh', JSON.stringify(data.refresh)),

            ])
                .then(() => {
                    resolve();
                });
        });
    }

    refreshToken(refreshToken: string): Observable<any> {
        return this.httpService.post<any>(`api/login/refresh/`, {
            refresh: refreshToken
        })
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