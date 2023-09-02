import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {Files, Photo} from "../core/images/models/photo.model";
import {ImagesService} from "../core/images/services/images.service";
import {ToastrService} from "ngx-toastr";
import {ApiResponse} from "../core/common/models/reponse.model";
import {catchError, forkJoin, map, throwError} from "rxjs";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    currentPage = 1;
    pageSize: number = 9;
    totalCount: number = 0;
    maxPages: number = 1;
    isOnlyPositioned: boolean = true;
    files: Files[] = [{className: "", files: [{}], order: 0, styleColumn: 0, uuid: ""}]

    result_1: Photo[] = [];
    result_2: Photo[] = [];
    result_3: Photo[] = [];

    photos: Photo[] = [];
    // @ts-ignore
    response: ApiResponse<Photo>;

    constructor(private photoService: ImagesService,
                private toastrService: ToastrService,
                private elementRef: ElementRef) {
        if (window.innerHeight <= 768) {
            this.pageSize = 14
        }
    }


    ngOnInit() {
        this.loadData()
    }

    loadData() {
        forkJoin([
            this.photoService.getFileRows()
        ]).pipe(
            catchError(() => {
                // this.handleLoadError();
                return throwError('Error occurred while fetching data.');
            }),
            map(([fileRowsResponse]) => {
                this.processFileRowsResponse(fileRowsResponse);
            })
        ).subscribe();
    }

    processFileRowsResponse(response: any) {
        // @ts-ignore
        response.results.forEach(element => {
            element.files.sort((a: any, b: any) => a.styleSide - b.styleSide);

            const expectedFilesCount = element.styleColumn + 1;
            // @ts-ignore
            const existingFileSides = element.files.map(file => file.styleSide);

            for (let side = 0; side < expectedFilesCount; side++) {
                if (!existingFileSides.includes(side)) {
                    element.files.splice(side, 0, {styleSide: side});
                }
            }
        });

        this.files = response.results;
    }

    handleLoadError() {
        this.toastrService.error('', 'Wystąpił błąd podczas pobierania zdjęć', {
            timeOut: 5000,
            progressAnimation: 'decreasing'
        });
    }
    getFileWidth(fileCount: number): string {
        return `calc(100% / ${fileCount})`;
    }

    // loadData() {
    //     this.photoService.getImages(this.currentPage, this.pageSize,this.isOnlyPositioned).subscribe((response) => {
    //         this.response = response
    //         this.totalCount = response.count
    //         this.photos = response.results
    //         this.maxPages = response.pages
    //         this.spliterData()
    //     }, () => {
    //         this.toastrService.error('', 'Wystąpił błąd podczas pobierania zdjęć', {
    //             timeOut: 5000,
    //             progressAnimation: 'decreasing'
    //         });
    //     })
    //
    //
    // }

    spliterData() {
        this.photos.forEach((item: any) => {
            if (item.column_id === 1) {
                this.result_1.push(item);
            } else if (item.column_id === 2) {
                this.result_2.push(item);
            } else {
                this.result_3.push(item)
            }
        })
    }

    @HostListener('window:scroll', [])
    onScroll() {
        const scrollPos = this.elementRef.nativeElement.scrollTop || document.documentElement.scrollTop || 0;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPos + windowHeight >= (documentHeight - 100)) {
            if (this.response.next && this.currentPage < this.maxPages) {
                this.currentPage += 1
                this.loadData()

            }

        }
    }

}
