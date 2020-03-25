import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core'
import { TableBulkDirective } from '../../directives/table-bulk.directive'
import { TableFieldDirective } from '../../directives/table-field.directive'
import { TableHeaderDirective } from '../../directives/table-header.directive'
import { TableRowAnimations } from '../../misc/animation'
import { Filters } from '../../misc/filter'
import { Sort } from '../../misc/request'
import { Table } from '../../misc/table-column'

@Component({
  selector: 'table-list[items][columns]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [TableRowAnimations]
})
export class TableComponent implements OnInit, AfterContentInit {

  @Input() items: any[]
  @Input() columns: Table.Columns
  @Input() rowHeight = 50
  @Input() rowBorder: 'default' | 'light' = 'default'
  @Input() isBodyBordered = false
  @Input() isHoveredRows = false
  @Input() isColumnsSwitchable = true
  @Input() selectedRows: Set<number> = new Set()
  @Input() loading = false
  @Input() smallNoDataLoadingBlocks = false
  @Input() cellMinWidth = 80

  @Output() filtersHandler = new EventEmitter<Filters>()
  @Output() scrollToBottomHandler = new EventEmitter()
  @Output() sortHandler = new EventEmitter<Sort>()

  @ContentChildren(TableFieldDirective) fieldTemplatesList: QueryList<TableFieldDirective>
  @ContentChildren(TableHeaderDirective) headerTemplatesList: QueryList<TableHeaderDirective>
  @ContentChild(TableBulkDirective, {static: false, read: TemplateRef}) bulkTemplate: TemplateRef<TableBulkDirective>

  fieldTemplates = new Map<string, TemplateRef<any>>()
  headerTemplates = new Map<string, TemplateRef<any>>()
  columnsKeys: string[] = []
  displayColumnKeys: string[] = []
  columnsWidth: string
  filters: Filters = new Map()
  currentFilterPopup = ''
  currentSortField = ''
  currentSortDirection: 'ASC' | 'DESC' = 'ASC'

  ngOnInit() {
    this.columnsKeys = Object.keys(this.columns)
    this.columnsKeys.forEach((key: string) => {
      if (this.columns[key].filterRequestKey) {
        this.filters.set(key, new Set())
      }
      if (!this.columns[key].defaultSwitchOff) {
        this.displayColumnKeys.push(key)
      }
    })
    this.generateColumnsWidth()
  }

  ngAfterContentInit() {
    this.fieldTemplatesList.forEach(fieldTemplate =>
      this.fieldTemplates.set(fieldTemplate.tableField, fieldTemplate.template)
    )
    this.headerTemplatesList.forEach(headerTemplate =>
      this.headerTemplates.set(headerTemplate.tableHeader, headerTemplate.template)
    )
  }

  isFilterable(key: string): boolean {
    return Boolean(this.columns[key].filterRequestKey)
  }

  isSortable(key: string): boolean {
    return Boolean(this.columns[key].sortable)
  }

  isFilterActive(key: string): boolean {
    if (!this.filters.has(key)) {
      return false
    }
    return Boolean(this.filters.get(key)!.size)
  }

  sortBy(key: string) {
    if (this.currentSortField !== key) {
      this.currentSortField = key
      this.currentSortDirection = 'ASC'
    } else {
      this.currentSortDirection = this.currentSortDirection === 'ASC' ? 'DESC' : 'ASC'
    }
    this.sortHandler.emit({sortBy: this.currentSortField, sortDirection: this.currentSortDirection})
  }

  getSortIcon(key: string): string {
    if (this.currentSortField === key) {
      return this.currentSortDirection === 'ASC' ? 'sort-asc' : 'sort-desc'
    }
    return 'sort-none'
  }

  toggleFilterPopup(key: string) {
    this.currentFilterPopup = key !== this.currentFilterPopup ? key : ''
  }

  handleColumnsSwitcher(columns: any) {
    this.displayColumnKeys = columns
    this.generateColumnsWidth()
  }

  handleFilters(filters: Filters) {
    this.filters = filters
    this.filtersHandler.emit(this.filters)
  }

  getValue(item: any, column: string) {
    const value = this.columns[column].value
    return value !== undefined ? value(item[column], item) : item[column]
  }

  private generateColumnsWidth() {
    this.columnsWidth = this.displayColumnKeys
      .map(key => {
        if (this.columns[key].width === 0) {
          return 0
        }
        return 'minmax(' + (this.columns[key].minWidth || this.cellMinWidth) + 'px, ' + (this.columns[key].width || 1) + 'fr)'
      })
      .join(' ')
  }

}
