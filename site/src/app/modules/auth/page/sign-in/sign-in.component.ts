import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  public signIn() {
    if (this.form.valid) {
      this.authService.authenticate(this.form.value).subscribe(res => {
        if (res.success) {
          this._snackBar.open('Success, redirecting...👉', 'Cool', { duration: 2000 });
          this.router.navigate(['/']);
          return;
        }
        this._snackBar.open('Wrong username or password.', 'Ok', {duration: 2000});
      });
    }
  }

}
