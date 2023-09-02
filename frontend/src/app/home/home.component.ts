import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {Files} from "../core/images/models/photo.model";
import {ImagesService} from "../core/images/services/images.service";
import {catchError, forkJoin, map, throwError} from "rxjs";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    currentPage = 1;
    pageSize: number = 9;
    maxPages: number = 1;
    files: Files[] = [{className: "", files: [{}], order: 0, styleColumn: 0, uuid: ""}]
    response: any

    constructor(private photoService: ImagesService,
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
                this.response = fileRowsResponse
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

    getFileWidth(fileCount: number): string {
        return `calc(100% / ${fileCount})`;
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
