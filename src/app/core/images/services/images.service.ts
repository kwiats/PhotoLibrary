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

}
