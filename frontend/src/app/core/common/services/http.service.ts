import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {SpinnerService} from '../../addons/services/spinner.service';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  sessionId = '';

  constructor(
    private httpClient: HttpClient,
    private spinnerService: SpinnerService
  ) {
  }

  public get apiUrl(): string {
    return environment.apiUrl;
  }

  public get<T>(
    url: string,
    params?: HttpParams,
    contentType?: string,
    successMessage?: string,
    errorMessage?: string,
    showPreloader: boolean = true
  ): Observable<T> {
    if (showPreloader) {
      this.spinnerService.showSpinner$.next(true);
    }
    return from(
      new Promise<T>(async (resolve, reject) => {
        const headers = await this.getHeaders(contentType || 'json');
        const options = {
          headers,
          params: params || null,
        };
        if (contentType === 'file') {
          // @ts-ignore
          options.responseType = 'blob' as 'json';
        }
        this.httpClient.get<T>(`${this.apiUrl}${url}`).subscribe(
          (res) => {
            if (successMessage) {
              console.log('Udało się!', 'success');
            }
            this.spinnerService.showSpinner$.next(false);
            resolve(res);
          },
          (err) => {
            this.spinnerService.showSpinner$.next(false);
            reject(err);
          }
        );
      })
    );
  }

  public post<T>(url: string, data: T, contentType?: string): Observable<T> {
    return from(new Promise<T>(async (resolve, reject) => {
      const headers = await this.getHeaders(contentType || 'json');
      this.httpClient
        .post<T>(`${this.apiUrl}${url}`, data, {
          headers
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => reject(err));
    }));
  }
  public put<T>(url: string, data: T): Observable<T> {
    return from(new Promise<T>(async (resolve, reject) => {
      const headers = await this.getHeaders();
      this.httpClient
        .put<T>(`${this.apiUrl}${url}`, data, {
          headers
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => reject(err));
    }));
  }
  public patch<T>(url: string, data: T): Observable<T> {
    return from(new Promise<T>(async (resolve, reject) => {
      const headers = await this.getHeaders();
      this.httpClient
        .patch<T>(`${this.apiUrl}${url}`, data, {
          headers
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => reject(err));
    }));
  }
  public delete<T>(url: string): Observable<T> {
    return from(new Promise<T>(async (resolve, reject) => {
      const headers = await this.getHeaders();
      this.httpClient
        .delete<T>(`${this.apiUrl}${url}`, {
          headers
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => reject(err));
    }));
  }

  async getHeaders(type: string = 'json', noAuth: boolean = false): Promise<HttpHeaders> {
    let headers = new HttpHeaders();
    if (!noAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers = headers.set(
          'Authorization',
          `Bearer ${token}`
        );
      }
    }
    if (type === 'json') {
      headers = headers.set('Content-Type', 'application/json; charset=utf-8;');
    }
    return headers;
  }

  async getAuthToken(): Promise<unknown> {
    return new Promise(resolve => {
      // @ts-ignore
      let accessToken = JSON.parse(localStorage.getItem('access'))
        if (accessToken) {
          try {
            const tokenData = jwt_decode(accessToken) as any;
            if (tokenData.exp >= (new Date().getTime() / 1000)) {
              resolve(accessToken);
            } else {
              resolve(null)
            }
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      })
  }
}
