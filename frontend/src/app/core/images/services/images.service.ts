import {Injectable} from '@angular/core';
import {HttpService} from "../../common/services/http.service";
import {Observable} from "rxjs";

import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../common/models/reponse.model";
import {FileElement, Files, Photo} from "../models/photo.model";

@Injectable({
    providedIn: 'root'
})
export class ImagesService {

    constructor(private http: HttpClient, private httpClient: HttpService) {
    }

    getImages(page: number = 1, pageSize: number = 10, isOnlyPositioned: boolean = false): Observable<ApiResponse<Photo>> {

        return this.httpClient.get(`api/photo/?page=${page}&pageSize=${pageSize}&isOnlyPositioned=${isOnlyPositioned}`)
    }

    getPhotoRows(): Observable<any> {
        return this.httpClient.get(`api/photo/rows`)
    }

    getPhotoColumns(): Observable<any> {
        return this.httpClient.get(`api/photo/columns`)
    }

    getAllFiles(): Observable<ApiResponse<FileElement>> {
        return this.httpClient.get(`api/photo/all-files`)
    }
    getFileRows(): Observable<ApiResponse<Files>> {
        return this.httpClient.get(`api/photo/files`)
    }

    uploadFile(data: any): Observable<any> {
        return this.httpClient.post('api/photo/file', data, 'application/json')
    }

    sendConfiguration(data: any): Observable<any> {
        return this.httpClient.post('api/photo/positions', data, 'application/json')
    }

    saveFileRows(data: any): Observable<any> {
        return this.httpClient.post('api/photo/file-rows', data, 'application/json')
    }

    getConfiguration(): Observable<any> {
        return this.httpClient.get('api/photo/positions')
    }

    deletePhoto(photoID: String | undefined): Observable<any> {
        return this.httpClient.delete(`api/photo/delete/${photoID}/`)
    }
}
