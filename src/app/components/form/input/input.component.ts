import { Component, Input, OnInit, Optional, Self } from '@angular/core'
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms'

@Component({
  selector: 'input-text',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements ControlValueAccessor, OnInit {

  @Input() placeholder = ''
  @Input() type = 'text'
  @Input() submitted: boolean
  @Input() showPasswordToggle: boolean
  @Input() trimRedundantZero: boolean

  @Input() mask: string
  @Input() showMaskTyped: boolean
  @Input() dropSpecialCharacters = true

  showPassword = false
  isRequired = false
  onChange: (value: any) => void
  onTouched: () => void

  control = new FormControl()

  constructor(@Optional() @Self() public ngControl: NgControl) {
    ngControl.valueAccessor = this
  }

  ngOnInit() {
    if (this.ngControl.control instanceof FormControl && this.ngControl.control.validator) {
      const validator = this.ngControl.control.validator(new FormControl(''))
      this.isRequired = Boolean(validator && validator.hasOwnProperty('required'))
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword
    this.type = this.showPassword ? 'text' : 'password'
  }

  innerChange() {
    this.onChange(this.control.value)
  }

  innerTouch() {
    if (this.trimRedundantZero) {
      const value = parseFloat(this.control.value) || ''
      this.onChange(value)
      this.writeValue(value.toString())
    }
    this.onTouched()
  }

  writeValue(value: string): void {
    this.control.setValue(value || '')
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable()
  }

  isInvalid() {
    return this.ngControl.control && (
      (this.ngControl.control.invalid && this.ngControl.control.touched) ||
      (this.ngControl.control.invalid && this.ngControl.control.dirty) ||
      (this.ngControl.control.invalid && this.submitted)
    )
  }

}
