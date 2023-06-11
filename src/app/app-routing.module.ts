import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { PhotosComponent } from './photos/photos.component';
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'edit',
    component: PhotosComponent,
  },
  {
    path: 'page/:slug',
    component: PageComponent,
  },{ path: '',   redirectTo: '/home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
