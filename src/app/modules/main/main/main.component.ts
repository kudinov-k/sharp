import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { environment } from '../../../../environments/environment'
import { RouterAnimations } from '../../../misc/animation'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [RouterAnimations]
})
export class MainComponent {

  constructor(private authService: AuthService,
              private router: Router) {
    if (!localStorage.getItem(environment.userTokenStorageKey)) {
      router.navigateByUrl('/auth/login')
    }
  }

}
