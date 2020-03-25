import { Component, Input } from '@angular/core'

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
  @Input() errors: any

  log(v: any) {
    console.log(v)
  }
}
