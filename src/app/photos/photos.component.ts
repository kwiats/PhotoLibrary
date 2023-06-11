import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import {Photo} from '../core/images/models/photo.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ImagesService} from "../core/images/services/images.service";

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css'],
})
export class PhotosComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, public photoService: ImagesService) {

  }

  result_1: Photo[] = [];
  result_2: Photo[] = [];
  result_3: Photo[] = [];

  photos: any;

  ngOnInit() {
    this.loadData()
  }


  loadData() {
    this.photoService.getImages().subscribe((response) => {
      this.photos = response
      this.spliterData();
    })

  }

  drop(event: CdkDragDrop<Photo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(this.result_1);
    console.log(this.result_2);
    console.log(this.result_3);
  }

  private spliterData() {
    if (this.photos) {
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
}

//TODO: Wykonac funkcje do podzialu listy na 3 listy(3 kolumny)
//TODO: wyswietlanie zdj w kazdje kolumnie flexem
//TODO: margines pomiedzy zdj 5px
//TODO: maks width 300-400px
