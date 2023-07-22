import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import {Photo} from '../core/images/models/photo.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ImagesService} from "../core/images/services/images.service";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-photos',
    templateUrl: './photos.component.html',
    styleUrls: ['./photos.component.css'],
})
export class PhotosComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, public photoService: ImagesService) {
    }
    isDisabled: boolean = true
    selectedFiles: any[] = [];

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

    selectFiles(event: any): void {
        if (event.target.files) {
            console.log(event.target.files)
            this.selectedFiles = event.target.files;
            this.isDisabled = false
        }

    }

    uploadFiles(): void {
        if (this.selectedFiles) {
            const formData: FormData = new FormData();
            for (let i = 0; i < this.selectedFiles.length; i++) {
                formData.append('file', this.selectedFiles[i])
            }
            this.photoService.uploadFile(formData);
            this.selectedFiles = []
            this.isDisabled = true
        } else {
            console.log('No files selected.');
        }
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

    spliterData() {
        this.photos = this.photos.sort((n1: any, n2: any) => {
            if (n1.order > n2.order) {
                return 1;
            }

            if (n1.order < n2.order) {
                return -1;
            }

            return 0;
        });
        this.photos.forEach((photo: any) => {
            switch (photo.column_id) {
                case 1: {
                    this.result_1.push(photo)
                    break;
                }
                case 2: {
                    this.result_2.push(photo)
                    break;
                }
                case 3: {
                    this.result_3.push(photo)
                    break;
                }


            }
        });
    }

    savePositions() {
        const formData: FormData = new FormData();
        formData.append('1', JSON.stringify(this.result_1))
        formData.append('2', JSON.stringify(this.result_2))
        formData.append('3', JSON.stringify(this.result_3))

        this.photoService.sendConfiguration(formData)
    }

    readFile(file: string) {
        return environment.apiUrl + file
    }
}

