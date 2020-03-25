import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'btn-flat',
  template: `
    <button (click)='onClickButton($event)' [ngClass]='[type, size, state, wide ? "wide" : ""]' [disabled]='state !== "active"'>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./btn-flat.component.scss']
})
export class BtnFlatComponent {
  @Output() handler = new EventEmitter<MouseEvent>()

  @Input() type: 'solid' | 'outline' | 'cancel' = 'solid'
  @Input() size: 'small' | 'big' | 'responsive' = 'big'
  @Input() state: 'active' | 'processed' | 'disabled' = 'active'
  @Input() wide = false

  onClickButton(event: MouseEvent) {
    this.handler.emit(event)
  }
}
