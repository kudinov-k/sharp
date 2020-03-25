import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms'
import * as moment from 'moment'

export const profilesEqualValidator = (profile1: string, profile2: string, errorName: string): ValidatorFn =>
  (
    (group: FormGroup): ValidationErrors | null => {
      const p1 = group.controls[profile1]
      const p2 = group.controls[profile2]
      const currentErrors = p2.errors || {}
      if (p2.dirty && p1.value === p2.value) {
        currentErrors[errorName] = true
      } else {
        delete currentErrors[errorName]
      }
      p2.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null)
      return null
    }
  ) as ValidatorFn

export const dateRangeValidator = (date1: string, format1: string, date2: string, format2: string, errorName: string): ValidatorFn =>
  (
    (group: FormGroup): ValidationErrors | null => {
      const dateControl1 = group.controls[date1]
      const dateControl2 = group.controls[date2]
      const currentErrors = dateControl2.errors || {}
      const d1 = moment(dateControl1.value, format1)
      const d2 = moment(dateControl2.value, format2)
      if (dateControl2.dirty && d1.diff(d2) > 0) {
        currentErrors[errorName] = true
      } else {
        delete currentErrors[errorName]
      }
      dateControl2.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null)
      return null
    }
  ) as ValidatorFn

export const mustMatchPasswordValidator = (controlName: string, matchingControlName: string) => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName]
    const matchingControl = formGroup.controls[matchingControlName]

    if (matchingControl.errors && !matchingControl.errors.passwordMismatch) {
      return
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({passwordMismatch: true})
    } else {
      matchingControl.setErrors(null)
    }
  }
}

export const customPatternValidator = (config: any): ValidatorFn => (
  (control: FormControl) => {
    const regExp: RegExp = config.pattern
    if (control.value && !control.value.toString().match(regExp)) {
      return {
        [config.errorKey]: config.errorKey
      }
    } else {
      return null
    }
  }
) as ValidatorFn

// regular expression patterns
export const textPattern = '^[a-zA-Z0-9\',. -]*$'
export const extendedTextPattern = /^[a-zA-Z0-9',./\\ "%#()&_@:!$*\-]*$/
export const passwordPattern = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()\-_=+{}\[\].,/\\'"|;:?<>`~]{8,})$/
export const maxLength255Pattern = /^.{0,255}$/
export const maxLength50Pattern = /^.{0,50}$/
export const zipPattern = /^[0-9]{5}(?:-[0-9]{4})?$/

// error names
export const passwordPatternMismatch = 'passwordPatternMismatch'
export const maxPasswordLength = 'maxPasswordLength'
