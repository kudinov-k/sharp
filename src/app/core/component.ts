import { OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { environment } from '../../environments/environment'
import { Filterable, Filters } from '../misc/filter'
import { RequestObject, Sort } from '../misc/request'
import { Table } from '../misc/table-column'

interface ItemList {
  list: any[]
  totalCount: number
}

export class BaseComponent implements OnDestroy {

  offset = 0
  limit = environment.pageLimit
  total = 0

  request = new RequestObject()

  submitted = false
  processed = false
  loading = false

  allItems: any[] = []
  items: any[] = []

  selectedRows: Set<number> = new Set()

  protected subs: Subscription = new Subscription()

  ngOnDestroy() {
    this.subs.unsubscribe()
  }


  getNextPage() {
    if (this.total > this.offset + this.limit) {
      this.offset += this.limit
      this.request.page = {offset: this.offset, limit: this.limit}
      this.loadList()
    }
  }

  handleItems = (response: ItemList) => {
    this.loading = false
    this.total = response.totalCount
    this.allItems = [...this.allItems, ...response.list]
    this.items = [...this.allItems]
  }

  resetPagination() {
    this.total = 0
    this.limit = environment.pageLimit
    this.offset = 0
    this.request.page = {offset: this.offset, limit: this.limit}
  }

  resetItems() {
    this.items = []
    this.allItems = []
    this.selectedRows = new Set()
  }

  resetList() {
    this.resetItems()
    this.resetPagination()
  }

  updateList() {
    this.resetList()
    this.loadList()
  }

  log(val: any) {
    console.log(val)
  }

  loadList() {
  }

  toFixedValue(value: any): string {
    return Number(value).toFixed(2)
  }

}


export class BaseTableComponent extends BaseComponent {

  columns: Table.Columns = {}

  filtersHandler(filters: Filters) {
    filters.forEach((value: Set<Filterable>, key: string) => {
      if (value.size) {
        this.request.search[this.columns[key].filterRequestKey!] = Array.from(value).map(v => v.id)
      } else {
        delete this.request.search[this.columns[key].filterRequestKey!]
      }
    })
    this.updateList()
  }

  sortHandler(sort: Sort) {
    this.request.sort = sort
    this.updateList()
  }
}

export class BaseToggleableTableComponent extends BaseTableComponent {

  get selectedRowsArray(): any[] {
    return Array.from(this.selectedRows)
  }

  get isAllSelected(): boolean {
    return Boolean(this.selectedRows.size && this.selectedRows.size === this.items.length)
  }

  toggleAll() {
    if (this.isAllSelected) {
      this.selectedRows = new Set()
    } else {
      this.selectedRows = new Set(this.items.map(item => item.id))
    }
  }

  toggleRow(id: number) {
    if (this.selectedRows.has(id)) {
      this.selectedRows.delete(id)
    } else {
      this.selectedRows.add(id)
    }
  }

}

