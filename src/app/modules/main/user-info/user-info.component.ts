import { Component, OnInit } from '@angular/core'
import { BaseComponent } from '../../../core/component'
import { User } from '../../../models/user'
import { AuthService } from '../../../services/auth.service'
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent extends BaseComponent implements OnInit {

  currentUser: User.Model | null

  constructor(private userService: UserService,
              private authService: AuthService) {
    super()
  }

  ngOnInit(): void {
    if (!this.authService.currentUser.getValue()) {
      this.userService.getMe()
    }
    this.subs.add(
      this.authService.currentUser.asObservable().subscribe(
        user => this.currentUser = user
      )
    )
  }

}
