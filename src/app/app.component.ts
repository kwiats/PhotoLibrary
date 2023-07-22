import { Component, OnInit } from '@angular/core';
import { Photo } from './core/images/models/photo.model';
import {ImagesService} from "./core/images/services/images.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  result_1: Photo[] = [];
  result_2: Photo[] = [];
  result_3: Photo[] = [];

    photos: any;

  constructor(private photoService: ImagesService) {


  }

  ngOnInit() {
    this.loadData()
  }


  loadData() {
    this.photoService.getImages().subscribe((response) => {
      this.photos = response
      this.spliterData();
    })

  }
  spliterData() {
    for (let i = 0; i < this.photos.length; i++) {
      if (i == 0 || i % 3 == 0) {
        this.result_1.push(this.photos[i]);
      } else if (i % 3 == 1) {
        this.result_2.push(this.photos[i]);
      } else {
        this.result_3.push(this.photos[i]);
      }
    }
  }
}
