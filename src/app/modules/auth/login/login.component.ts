import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { BaseComponent } from '../../../core/component'
import { AuthService } from '../../../services/auth.service'
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  loginForm: FormGroup

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private toastrService: ToastrService,
              private userService: UserService) {
    super()
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    })
  }

  login() {
    this.submitted = true
    if (!this.loginForm.valid) {
      return
    }
    this.processed = true

    this.subs.add(
      this.authService.login(this.loginForm.value).subscribe(
        ignore => {
          this.userService.getMe()
          this.router.navigateByUrl('/')
        },
        error => {
          this.toastrService.error(error)
          this.processed = false
        }
      )
    )
  }

}
