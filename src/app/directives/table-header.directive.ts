import { Directive, Input, TemplateRef } from '@angular/core'

@Directive({
  selector: 'ng-template[tableHeader]'
})
export class TableHeaderDirective {
  @Input() tableHeader: string

  constructor(public template: TemplateRef<any>) {
  }
}
