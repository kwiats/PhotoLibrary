import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {PhotosComponent} from './photos/photos.component';

import {HomeComponent} from './home/home.component';
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AuthenticationComponent} from './authentication/authentication.component';
import {AboutComponent} from './page/about/about.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ToastrModule} from 'ngx-toastr';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {LoadingComponent} from './core/addons/components/loading/loading.component';
import {LoadingInterceptor} from "./core/addons/interceptor/loading.interceptor";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        PhotosComponent,
        HomeComponent,
        AuthenticationComponent,
        AboutComponent,
        LoadingComponent,

    ],
    imports: [
        FontAwesomeModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-top-right',
            preventDuplicates: true,
        }),
        HttpClientModule,
        DragDropModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, {
        provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    }],
    bootstrap: [AppComponent],
})
export class AppModule {
}
