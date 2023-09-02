import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PhotosComponent} from "./photos/photos.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./core/auth/services/auth-guard.service";
import {AuthenticationComponent} from "./authentication/authentication.component";
import {AboutComponent} from "./page/about/about.component";
import {NewphotoComponent} from "./newphoto/newphoto.component";

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
                component: NewphotoComponent,
                canActivate: [AuthGuard]
            }
        ]
    },

    {
        path: "home",
        component: HomeComponent,
    },
    // {
    //     path: "newphoto",
    //     component: NewphotoComponent,
    // },
    {
        path: 'page',
        children: [
            {
                path: 'about',
                component: AboutComponent
            },
        ]
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
