import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators'
import { BaseComponent } from '../../../core/component'
import { Filterable, FilterList, Filters } from '../../../misc/filter'
import { RequestObject } from '../../../misc/request'

@Component({
  selector: 'filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss']
})
export class FilterPopupComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() position: 'left' | 'right'
  @Input() currentField = ''
  @Input() label = ''
  @Input() fieldName: string
  @Input() valuesObservable: (r: RequestObject) => Observable<FilterList>
  @Input() requestObject?: RequestObject
  @Input() filters: Filters
  @Output() updateFilters = new EventEmitter<Filters>()
  @Output() handlerFilterClick = new EventEmitter<string>()

  items: Filterable[]
  searchText = new FormControl()
  request = new RequestObject()

  selectedFilterItems = new Set<any>()

  get isOpen(): boolean {
    return this.currentField === this.fieldName
  }

  ngOnInit() {
    if (this.requestObject) {
      this.request = this.requestObject
    }
    this.subs.add(
      this.searchText.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => !value || value.toString().trim().length > 2),
        switchMap(value => {
          this.request.search = value ? {searchString: value.trim()} : {}
          this.resetItems()
          this.resetPagination()
          this.loading = true
          return this.valuesObservable(this.request)
        })
      ).subscribe(this.handleItems)
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isOpen && this.valuesObservable) {
      this.loadList()
    }
  }

  togglePopup() {
    if (!this.isOpen) {
      this.resetItems()
      this.resetPagination()
      this.selectedFilterItems = new Set(Array.from(this.filters.get(this.fieldName)!).map(obj => obj.id))
    } else {
      this.selectedFilterItems.clear()
    }
    this.handlerFilterClick.emit(this.fieldName)
  }


  clearAll() {
    this.selectedFilterItems.clear()
    this.searchText.setValue('')
  }

  toggleAll() {
    this.selectedFilterItems = new Set(this.items.map(i => i.id))
  }

  toggleRow(item: any) {
    if (this.selectedFilterItems.has(item)) {
      this.selectedFilterItems.delete(item)
    } else {
      this.selectedFilterItems.add(item)
    }
  }

  onSave() {
    this.filters.set(this.fieldName, new Set(
      this.items.filter(i => this.selectedFilterItems.has(i.id))
      )
    )
    this.updateFilters.emit(this.filters)
    this.togglePopup()
  }

  loadList() {
    this.loading = true
    this.subs.add(
      this.valuesObservable(this.request).subscribe(this.handleItems)
    )
  }

}
