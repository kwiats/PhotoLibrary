import {Component, OnInit} from '@angular/core';
import {Photo} from "../core/images/models/photo.model";
import {ImagesService} from "../core/images/services/images.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private photoService: ImagesService) {
  }
  result_1: Photo[] = [];
  result_2: Photo[] = [];
  result_3: Photo[] = [];

  photos: any;

  ngOnInit() {
    this.loadData()
  }


  loadData() {
    this.photoService.getConfiguration().subscribe((response) => {
      this.photos = response
      this.spliterData();
    })


  }
  spliterData() {
    this.result_1 = JSON.parse(this.photos.columns['1'])
    this.result_2 = JSON.parse(this.photos.columns['2'])
    this.result_3 = JSON.parse(this.photos.columns['3'])
  }

  readFile(file: string){
        return environment.apiUrl + file
    }



}
