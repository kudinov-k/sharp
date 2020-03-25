import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Table } from '../../../misc/table-column'

@Component({
  selector: 'columns-switcher',
  templateUrl: './columns-switcher.component.html',
  styleUrls: ['./columns-switcher.component.scss']
})
export class ColumnsSwitcherComponent implements OnInit, OnDestroy {

  @Input() columns: Table.Columns
  @Input() displayColumnKeys: string[]
  @Output() updateColumnList = new EventEmitter()

  showPopup = false
  columnKeys: string[]
  columnsForm: FormGroup
  subscription: Subscription

  ngOnInit() {
    this.columnKeys = Object.keys(this.columns)
    const group: any = {}
    this.columnKeys.forEach(
      key => group[key] = new FormControl(this.displayColumnKeys.includes(key) && !this.columns[key].defaultSwitchOff)
    )
    this.columnsForm = new FormGroup(group)
    this.subscription = this.columnsForm.valueChanges.subscribe(value => {
      this.updateColumnList.emit(Object.keys(value).filter(key => value[key]))
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  togglePopup() {
    this.showPopup = !this.showPopup
  }
}
