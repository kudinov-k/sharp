import { Component, Input } from '@angular/core'

@Component({
  selector: 'auth-wrapper',
  templateUrl: './auth-wrapper.component.html',
  styleUrls: ['./auth-wrapper.component.scss']
})
export class AuthWrapperComponent {
  @Input() header: string
  @Input() subText: string
}
