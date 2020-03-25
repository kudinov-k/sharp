import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { environment } from '../../../../environments/environment'
import { BaseComponent } from '../../../core/component'
import { mustMatchPasswordValidator, textPattern } from '../../../misc/validators'
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent extends BaseComponent implements OnInit {

  registrationForm: FormGroup

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastrService: ToastrService,
              private userService: UserService) {
    super()
  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.pattern(textPattern)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    }, {
      validator: mustMatchPasswordValidator('password', 'confirmPassword')
    })
  }

  register() {
    this.submitted = true
    if (!this.registrationForm.valid) {
      return
    }
    this.processed = true

    delete this.registrationForm.value['confirmPassword']

    this.subs.add(
      this.userService.addUser(this.registrationForm.value).subscribe(
        userToken => {
          localStorage.setItem(environment.userTokenStorageKey, userToken.token)
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
