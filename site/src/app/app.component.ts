import { Component } from '@angular/core';
import { AuthService } from './modules/auth/auth.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  constructor(private authService: AuthService, private router: Router) {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
