import {Injectable} from '@angular/core';
import {HttpService} from "../../common/services/http.service";
import {TokenPair, User} from "../models/user.model";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpService
    ) {
    }

    login(login: string,
          password: string): Observable<TokenPair> {
        return this.http.post<any>(`login/`, {
            username: login,
            password
        }, 'application/json');
    }

    refreshToken(refreshToken: string): Observable<TokenPair> {
        return this.http.post<any>(`login/refresh/`, {
            refreshToken
        }, 'application/json');
    }
}
