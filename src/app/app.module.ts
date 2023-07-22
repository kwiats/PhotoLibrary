import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {PhotosComponent} from './photos/photos.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PageComponent} from './page/page.component';
import {HomeComponent} from './home/home.component';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login/login.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PhotosComponent,
    PageComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DragDropModule,
    RouterModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
