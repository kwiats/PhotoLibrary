import { Component, OnInit } from '@angular/core';
import { Photo } from './core/images/models/photo.model';
import {ImagesService} from "./core/images/services/images.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent{

  constructor() {
  }

}
