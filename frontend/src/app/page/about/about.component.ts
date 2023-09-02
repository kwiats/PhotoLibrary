import {Component} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../core/auth/services/auth.service";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    messageForm: FormGroup;

    constructor(private toastrService: ToastrService,
                private formBuilder: FormBuilder,
                private authService: AuthService) {
        this.messageForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
            message: ['', Validators.required],
        });
    }

    sendMessage() {

        if (this.messageForm.valid) {
            const data = this.messageForm.getRawValue()
            this.authService.sendMail(data).subscribe((res: any) => {
                console.log(res)
            })
        } else {
            this.toastrService.warning(
                'Formularz jest trakcie budowania..', 'Błąd podczas wysyłania wiadomosci', {
                    timeOut: 3000,
                    progressAnimation: 'decreasing'
                });
        }


    }

}
