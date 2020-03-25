import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Filterable } from '../../../../misc/filter'

@Component({
  selector: 'filter-card',
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.scss']
})
export class FilterCardComponent {
  @Input() columnTitle: string
  @Input() values: Set<Filterable>
  @Output() removeValue = new EventEmitter<any>()
}
