import {Component, OnInit} from '@angular/core';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import {Photo} from '../core/images/models/photo.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ImagesService} from "../core/images/services/images.service";
import {environment} from "../../environments/environment";
import {ToastrService} from "ngx-toastr";
import {NgFor} from "@angular/common";

@Component({
    selector: 'app-photos',
    templateUrl: './photos.component.html',
    styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
    constructor(private route: ActivatedRoute,
                private router: Router,
                public photoService: ImagesService,
                private toastrService: ToastrService) {

    }


    isDisabled: boolean = true
    selectedFiles: any[] = [];

    optionPhoto: any;

    newPhotos: Photo[] = [];
    unPositioned: Photo[] = [];
    result_1: Photo[] = [];
    result_2: Photo[] = [];
    result_3: Photo[] = [];

    options = [
        {
            name: 'Delete',
            icon: 'fa-solid fa-trash',
            function: (photo: Photo) => this.deletePhoto(photo)
        }
    ]

    photos: any;

    ngOnInit() {
        this.loadData()
    }


    loadData() {
        this.newPhotos = [];
        this.unPositioned = [];
        this.result_1 = [];
        this.result_2 = [];
        this.result_3 = [];
        this.photoService.getImages(1, 99999).subscribe((response) => {
            this.photos = response.results
            this.spliterData();
        }, () => {
            this.toastrService.error('', 'Wystąpił błąd podczas pobierania zdjęć', {
                timeOut: 5000,
                progressAnimation: 'decreasing'
            });
        })
    }




    selectFiles(event: any): void {
        if (event.target.files) {
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
            this.photoService.uploadFile(formData).subscribe(() => {
                this.toastrService.success('', `Dodano ${this.selectedFiles.length} zdjęć `, {
                    timeOut: 2000,
                    progressAnimation: 'decreasing'
                });
                this.selectedFiles = []
                this.isDisabled = true
                this.loadData()
            }, () => {
                this.toastrService.error('', 'Błąd podczas dodwania zdjęć', {
                    timeOut: 1000,
                    progressAnimation: 'decreasing'
                });
            });


        } else {
            this.toastrService.error('', 'No files selected', {
                timeOut: 1000,
                progressAnimation: 'decreasing'
            });
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
            if (photo.status == 'POSITIONED') {
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
            } else if (photo.status == 'NEW') {
                this.newPhotos.push(photo)
            } else{
                this.unPositioned.push(photo)
            }

        });
    }

    savePositions() {
        const formData: FormData = new FormData();
        formData.append('1', JSON.stringify(this.result_1))
        formData.append('2', JSON.stringify(this.result_2))
        formData.append('3', JSON.stringify(this.result_3))

        this.photoService.sendConfiguration(formData).subscribe(() => {
            this.toastrService.success('', 'Zapisano poprawnie konfiguracje', {
                timeOut: 3000,
                progressAnimation: 'decreasing'
            });
            this.loadData()
        }, () => {
            this.toastrService.warning('', 'Błąd podczas zapisywania konfiguracji', {
                timeOut: 3000,
                progressAnimation: 'decreasing'
            });
        })


    }

    readFile(file: any) {
        return environment.apiUrl.slice(0, -1) + file
    }

    showOptions(photo: Photo) {
        if (this.optionPhoto === photo) {
            this.optionPhoto = null
        } else {
            this.optionPhoto = photo
        }
    }

    deletePhoto(photo: Photo) {
        this.optionPhoto = null
        if (photo) {
            this.photoService.deletePhoto(photo.uuid).subscribe((res) => {
                this.toastrService.success('', 'Usunięto zdjęcie poprawnie', {
                    timeOut: 3000,
                    progressAnimation: 'decreasing'
                });
                this.loadData()
            }, () => {
                this.toastrService.error('', 'Wystąpił błąd podczas usuwania', {
                    timeOut: 3000,
                    progressAnimation: 'decreasing'
                });
                this.loadData()
            })

        }
    }

}
