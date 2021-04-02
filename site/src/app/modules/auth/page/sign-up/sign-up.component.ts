import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

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

  public signUp() {
    if (this.form.valid) {
      this.authService.createProfile(this.form.value).subscribe(res => {
        if (res.success) {
          this._snackBar.open('You just created your profile! 👍', 'Cool', {duration: 2000});
          this.router.navigate(['/']);
          return;
        }
        this._snackBar.open('Username already taken.', 'Ok', {duration: 2000});
      });
    }
  }

}
