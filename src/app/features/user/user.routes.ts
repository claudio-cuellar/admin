import { Routes } from "@angular/router";
import { UserProfileComponent } from "./profile/user-profile.component";

export const userRoutes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full'
  },
  { path: 'profile', component: UserProfileComponent },
];