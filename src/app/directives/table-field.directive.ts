import { Directive, Input, TemplateRef } from '@angular/core'

@Directive({
  selector: 'ng-template[tableField]'
})
export class TableFieldDirective {
  @Input() tableField = ''

  constructor(public template: TemplateRef<any>) {
  }
}
