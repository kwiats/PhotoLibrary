import {Component} from '@angular/core';
import {LoadingService} from "../../services/loading.service";

@Component({
    selector: 'app-spinner',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
    constructor(public loader: LoadingService) {
    }
}
