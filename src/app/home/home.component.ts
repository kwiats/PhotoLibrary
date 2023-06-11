import {Component, OnInit} from '@angular/core';
import {Photo} from "../core/images/models/photo.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  result_1: Photo[] = [];
  result_2: Photo[] = [];
  result_3: Photo[] = [];

  photos: Photo[] = [
    { slug: 'image_1',photo: './../assets/images/image_1.jpg' },
    { slug: 'image_1',photo: './../assets/images/image_2.jpeg' },
    { slug: 'image_1',photo: './../assets/images/image_3.jpg' },
    { slug: 'image_1',photo: './../assets/images/image_4.jpg' },
    { slug: 'image_1',photo: './../assets/images/image_5.jpg' },
    { slug: 'image_1',photo: './../assets/images/image_1.jpg' },
  ];
  ngOnInit() {
    this.spliterData();
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
