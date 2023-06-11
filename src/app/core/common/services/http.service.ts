import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {SpinnerService} from '../../addons/services/spinner.service';

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

  async getHeaders(type: string = 'json'): Promise<HttpHeaders> {
    this.sessionId =
      window.localStorage.getItem('sessionId') || 'session-not-set';
    let headers = new HttpHeaders();
    const token = window.localStorage.getItem('access');
    if (token) {
      const tokenObject = JSON.parse(token);
      headers = headers.set(
        'Authorization',
        `Bearer ${tokenObject.idToken || tokenObject}`
      );
    }
    headers = headers.set('Accept-Language', 'pl');
    headers = headers.set('SessionId', this.sessionId);
    return headers;
  }
}
