import {Component, Renderer2} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {FileElement, Files} from "../core/images/models/photo.model";
import {ImagesService} from "../core/images/services/images.service";
import {ToastrService} from "ngx-toastr";
import {catchError, forkJoin, map, throwError} from "rxjs";

@Component({
    selector: 'app-newphoto',
    templateUrl: './newphoto.component.html',
    styleUrls: ['./newphoto.component.css']
})
export class NewphotoComponent {

    isDisabled: boolean = true
    isOpenOptions: boolean = false
    selectedFiles: any[] = [];
    selectedFile: any;
    selectedRow: any;

    unpositioned_files: FileElement[] = []
    new_files: FileElement[] = []
    files: Files[] = [{className: "", files: [{}], order: 0, styleColumn: 0, uuid: ""}]


    constructor(public photoService: ImagesService,
                private toastrService: ToastrService,
                private renderer: Renderer2) {
        this.loadData()
    }

    loadData() {
        forkJoin([
            this.photoService.getAllFiles(),
            this.photoService.getFileRows()
        ]).pipe(
            catchError(() => {
                this.handleLoadError();
                return throwError('Error occurred while fetching data.');
            }),
            map(([allFilesResponse, fileRowsResponse]) => {
                this.processAllFilesResponse(allFilesResponse);
                this.processFileRowsResponse(fileRowsResponse);
            })
        ).subscribe();
    }

    processAllFilesResponse(response: any) {
        this.unpositioned_files = response.results.filter((result: any) => result.status === "unpositioned");
        this.new_files = response.results.filter((result: any) => result.status === "new");
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

    changeStyleColumn(row: any, element: any, value: number) {
        const numRows = row.files.length;
        switch (value) {
            case 0:
                if (numRows !== 1) {
                    row.files.forEach((e: any, index: number) => {
                        if (!e.file) {
                            row.files.splice(index, 1);
                        }
                    })
                    row.files.forEach((e: any, index: number) => {
                        if (e.uuid !== element.uuid) {
                            e.status = 'UNPOSITIONED';
                            this.unpositioned_files.push(e);
                            row.files.splice(index, 1);
                        } else {
                            row.styleColumn = value;


                        }
                    });
                }
                row.styleColumn = value;
                break;

            case 1:
                if (numRows === 3) {
                    row.files.forEach((e: any, index: number) => {
                        if (!e.file) {
                            row.files.splice(index, 1);
                        }
                    })
                    row.files.forEach((e: any, index: number) => {
                        if (row.files.length === 3) {
                            if (!e.file) {
                                row.files.splice(index, 1);
                            } else if (e !== element && e.file) {
                                e.status = 'UNPOSITIONED';
                                this.unpositioned_files.push(e);
                                row.files.splice(index, 1);
                            } else {
                                row.styleColumn = value;
                            }
                        }

                    });
                } else if (numRows === 1) {
                    row.files.push({});
                }
                row.styleColumn = value;
                break;

            case 2:
                if (numRows === 2) {
                    row.files.push({});
                } else if (numRows === 1) {
                    row.files.push({}, {});
                }
                row.styleColumn = value;
                break;

            default:
                row.styleColumn = 0;
                break;
        }
    }

    changeStyleSize(row: any, element: any, value: any) {
        element.styleSize = value
    }

    confirmStyle(element: any) {
        element.isDropped = false
    }

    deleteFile(element: any) {
        for (const e of this.files) {
            const fileIndex = e.files.findIndex((f: any) => f.uuid === element.uuid);
            if (fileIndex !== -1) {
                e.files.splice(fileIndex, 1);
                e.files.push({})
                element.status = 'UNPOSITIONED'
                element.isDropped = false
                this.unpositioned_files.push(element)
                break;
            }
        }
    }


    drop(row: Files, event: CdkDragDrop<FileElement[]>) {
        console.log(event)
        this.files.forEach((row: any) => {
            row.files.forEach((file: any) => {
                file.isDropped = false
            })
        })
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {

            let mountColumns = row.styleColumn + 1
            let element = row.files[event.currentIndex]
            for (let index = event.container.data.length - 1; index >= 0; index--) {
                const e = event.container.data[index];
                if (!e.file) {
                    event.container.data.splice(index, 1);
                    break;
                }
            }
            if (event.container.data.length < 3) {
                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex,
                );


                if (event.previousContainer.data.length < mountColumns) {
                    event.previousContainer.data.push({})
                }
                if (event.container.data) {
                    let styleColumn = event.container.data.length - 1

                    let otherElement = event.container.data.find((e: any) => {
                        if (e.uuid !== element.uuid) {
                            return e
                        }
                    })
                    event.container.data.forEach((f: any, index: number) => {
                        event.container.data[index].order = otherElement?.order
                    })

                    if (otherElement) {
                        // @ts-ignore
                        this.files[otherElement.order].styleColumn = styleColumn
                    }

                }
            }

        }
        if (row.files[event.currentIndex]) {
            row.files[event.currentIndex].isDropped = true
        }

    }

    dropOther(event: any) {
        event.previousContainer.data.push({})
        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
        );
    }

    getFileWidth(fileCount: number): string {
        return `calc(100% / ${fileCount})`;
    }

    addRow() {
        this.files.push({className: "", files: [{}], order: 0, styleColumn: 0, uuid: ""})
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

    savePositions() {
        const formData: FormData = new FormData();
        this.files.forEach((res: Files, index: number) => {
            res.files.forEach((el: FileElement, index: number) => {
                el.styleSide = index
            })
            formData.append(String(index), JSON.stringify(res))
        })


        this.photoService.saveFileRows(formData).subscribe(() => {
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

    over(element: any) {
        const fileElement = document.getElementById(element.uuid)
        if (this.isOpenOptions) {
            this.files.forEach((row: any) => {
                row.files.forEach((file: any) => {
                    const temp_file = document.getElementById(file.uuid)
                    this.renderer.setStyle(temp_file, 'border', '')
                })
            })
            if (this.selectedFile && element.uuid !== this.selectedFile.uuid) {
                this.renderer.setStyle(fileElement, 'border', 'solid 4px green')
            }
        }
    }

    swipeFile(element: any, row: any) {
        if (!this.isOpenOptions || !this.selectedFile) {
            return;
        }

        // Clear borders on all files
        this.clearFileBorders();

        if (element.uuid === this.selectedFile.uuid) {
            this.clearElements();
            this.sortFiles();
            return;
        }

        if (this.selectedRow.order !== row.order) {
            // Swap files between rows
            this.swapFilesBetweenRows(element, row);
        } else {
            // Swap files within the same row
            this.swapFilesWithinRow(element);
        }

        this.clearElements();
        this.sortFiles();
    }

    clearFileBorders() {
        this.files.forEach((row: any) => {
            row.files.forEach((file: any) => {
                const temp_file = document.getElementById(file.uuid);
                this.renderer.setStyle(temp_file, 'border', '');
            });
        });
    }

    swapFilesBetweenRows(element: any, row: any) {
        const tempFiles = row.files.filter((e: any) => e.uuid !== element.uuid);
        const tempStyleSide = this.selectedFile.styleSide;

        this.selectedFile.styleSide = element.styleSide;
        element.styleSide = tempStyleSide;
        this.selectedFile.isDropped = false;

        tempFiles.push(this.selectedFile);
        row.files = tempFiles;

        const tempFilesSelected = this.selectedRow.files.filter((e: any) => e.uuid !== this.selectedFile.uuid);
        tempFilesSelected.push(element);

        this.files.forEach((e: any) => {
            if (e.order === this.selectedRow.order) {
                e.files = tempFilesSelected;
            }
        });
    }

    swapFilesWithinRow(element: any) {
        const tempStyleSide = this.selectedFile.styleSide;
        this.selectedFile.styleSide = element.styleSide;
        element.styleSide = tempStyleSide;
    }

    openOptions(element: any, row: any) {
        this.files.forEach((row: any) => {
            row.files.forEach((file: any) => {
                if (file.uuid !== element.uuid) {
                    file.isDropped = false

                }
            })
        })

        element.isDropped = !element.isDropped

        if (element.isDropped) {
            this.isOpenOptions = true
            this.selectedFile = element
            this.selectedRow = row
        } else {
            this.isOpenOptions = false
            this.selectedFile = null
            this.selectedRow = null
        }
    }

    clearElements() {
        this.files.forEach((row: any) => {
            row.files.forEach((file: any) => {
                file.isDropped = false
            })
        })
        this.selectedRow = null
        this.selectedFile = null
    }

    sortFiles() {
        this.files.forEach((element) => {
            // @ts-ignore
            element.files.sort((a: FileElement, b: FileElement) => a.styleSide - b.styleSide);
        })
    }

}
