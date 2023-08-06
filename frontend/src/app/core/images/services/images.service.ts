import {Injectable} from '@angular/core';
import {HttpService} from "../../common/services/http.service";
import {Observable} from "rxjs";
import {Photo} from "../models/photo.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ImagesService {

    constructor(private http: HttpClient, private httpClient: HttpService) {
    }

    getImages(): Observable<Photo> {
        return this.httpClient.get(`api/photo/`)
    }

    uploadFile(data: any): Observable<any> {
        return this.httpClient.post('api/photo/', data, 'application/json')
    }

    sendConfiguration(data: any): Observable<any> {
        return this.httpClient.post('api/photo/positions', data, 'application/json')
    }

    getConfiguration(): Observable<any> {
        return this.httpClient.get('api/photo/positions')
    }

    deletePhoto(photoID: String | undefined): Observable<any> {
        return this.httpClient.delete(`api/photo/delete/${photoID}/`)
    }
}
