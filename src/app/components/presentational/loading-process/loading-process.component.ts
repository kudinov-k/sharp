import { Component, Input } from '@angular/core'

@Component({
  selector: 'loading-process',
  templateUrl: './loading-process.component.html',
  styleUrls: ['./loading-process.component.scss']
})
export class LoadingProcessComponent {
  @Input() small = false
}
