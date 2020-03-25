import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ClickOutsideModule } from 'ng-click-outside'
import { TableBulkDirective } from '../../directives/table-bulk.directive'
import { TableFieldDirective } from '../../directives/table-field.directive'
import { TableHeaderDirective } from '../../directives/table-header.directive'
import { FormKitModule } from '../form/form.module'
import { KitModule } from '../presentational/kit.module'
import { ColumnsSwitcherComponent } from './columns-switcher-popup/columns-switcher.component'
import { FilterPopupComponent } from './filter-popup/filter-popup.component'
import { FilterCardComponent } from './filters-bar/filter-card/filter-card.component'
import { FiltersBarComponent } from './filters-bar/filters-bar.component'
import { TableComponent } from './table.component'

@NgModule({
  declarations: [
    TableComponent,
    FiltersBarComponent,
    FilterCardComponent,
    FilterPopupComponent,
    ColumnsSwitcherComponent,
    TableFieldDirective,
    TableHeaderDirective,
    TableBulkDirective
  ],
  imports: [
    CommonModule,
    KitModule,
    FormKitModule,
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    TableFieldDirective,
    TableHeaderDirective,
    TableBulkDirective,
    TableComponent
  ]
})
export class TableModule {
}
