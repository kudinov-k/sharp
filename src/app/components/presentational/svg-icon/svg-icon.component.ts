import { Component, Input } from '@angular/core'

@Component({
  selector: 'svg-icon',
  styleUrls: ['./svg-icon.component.scss'],
  template: `
    <svg [attr.width]='width' [attr.height]='height'>
      <use [attr.xlink:href]='"#" + icon'></use>
    </svg>
  `
})
export class SvgIconComponent {
  @Input() icon!: string
  @Input() width: number | string = 22
  @Input() height: number | string = 22
}
