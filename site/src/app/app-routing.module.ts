import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard, GuestGuard } from './modules/auth/auth.module';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component:AppComponent},
  { path: 'sign-in', pathMatch: 'full', redirectTo: 'auth'},
  { 
    path: 'auth',
    canActivate: [GuestGuard],
    loadChildren: () => import('./modules/auth/auth-routing.module').then(m => m.AuthRoutingModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
