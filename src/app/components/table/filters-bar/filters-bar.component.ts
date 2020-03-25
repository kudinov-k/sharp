import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Filters } from '../../../misc/filter'
import { Table } from '../../../misc/table-column'

@Component({
  selector: 'filters-bar',
  templateUrl: './filters-bar.component.html',
  styleUrls: ['./filters-bar.component.scss']
})
export class FiltersBarComponent {

  @Input() columns: Table.Columns
  @Input() filters: Filters
  @Output() updateFilters = new EventEmitter<Filters>()

  removeFilterValues(value: any, key: string) {
    this.filters.get(key)!.delete(value)
    this.updateFilters.emit(this.filters)
  }

  clearAll() {
    this.filters.forEach(set => set.clear())
    this.updateFilters.emit(this.filters)
  }

}
