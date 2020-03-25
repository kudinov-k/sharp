import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { Subject } from 'rxjs'

@Component({
  selector: 'ng-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `
})
export class NgOptionComponent implements OnChanges, AfterViewChecked, OnDestroy {

  @Input() value: any
  readonly stateChange$ = new Subject<{ value: any, disabled: boolean, label?: string }>()
  /*tslint:disable-next-line:variable-name*/
  private _previousLabel: string

  constructor(public elementRef: ElementRef<HTMLElement>) {
  }

  /*tslint:disable-next-line:variable-name*/
  private _disabled = false

  @Input()
  get disabled() {
    return this._disabled
  }

  set disabled(value: any) {
    this._disabled = this._isDisabled(value)
  }

  get label(): string {
    return (this.elementRef.nativeElement.textContent || '').trim()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled) {
      this.stateChange$.next({
        value: this.value,
        disabled: this._disabled
      })
    }
  }

  ngAfterViewChecked() {
    if (this.label !== this._previousLabel) {
      this._previousLabel = this.label
      this.stateChange$.next({
        value: this.value,
        disabled: this._disabled,
        label: this.elementRef.nativeElement.innerHTML
      })
    }
  }

  ngOnDestroy() {
    this.stateChange$.complete()
  }

// @ts-ignore
  private _isDisabled(value) {
    return value != null && `${value}` !== 'false'
  }
}
