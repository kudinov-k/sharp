import { Component, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core'
import { CheckboxControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'form-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxComponent)
    }
  ]
})
export class CheckboxComponent extends CheckboxControlValueAccessor {

  @HostBinding('attr.id') externalId = ''
  @Input('value') currentValue: any = false
  @Input() content: any
  @Input() disabled = false
  @Input() isInForm = false
  @Output() clickHandler = new EventEmitter()

  private _ID = ''

  get value() {
    return this.currentValue
  }

  set value(val) {
    this.currentValue = val
    this.onChange(val)
    this.onTouched()
  }

  get id() {
    return this._ID || this.externalId
  }

  @Input()
  set id(value: string) {
    this._ID = value
    this.externalId = ''
  }

  writeValue(value: any) {
    this.value = value
  }

  switch() {
    if (this.disabled) {
      return
    }
    this.value = this.value ? false : this.content || true
    this.clickHandler.emit()
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }
}
