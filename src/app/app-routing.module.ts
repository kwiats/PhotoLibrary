import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PageComponent} from "./page/page.component";
import {PhotosComponent} from "./photos/photos.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./core/auth/services/auth-guard.service";
import {AuthenticationComponent} from "./authentication/authentication.component";

const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                component: AuthenticationComponent
            },
            {
                path: "edit",
                component: PhotosComponent,
                canActivate: [AuthGuard]
            }
        ]
    },

    {
        path: "home",
        component: HomeComponent,
    },
    {
        path: "page/:slug",
        component: PageComponent,
    },
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full",
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
