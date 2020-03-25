import { Component, OnInit } from '@angular/core'
import { BaseTableComponent } from '../../../core/component'
import { Table } from '../../../misc/table-column'
import { Transaction } from '../../../models/transaction'
import { TransactionService } from '../../../services/transaction.service'

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends BaseTableComponent implements OnInit {

  items: Transaction.Model[] = []

  columns: Table.Columns = {
    id: {
      label: 'ID',
      width: 0.1,
      switchable: false,
    },
    date: {
      label: 'Date/Time',
      width: 0.6,
    },
    username: {
      label: 'Correspondent Name',
    },
    amount: {
      label: 'Transaction amount',
      width: 0.6,
      labelStyle: {justifyContent: 'flex-end'},
      valueCellStyle: {justifyContent: 'flex-end'},
      valueStyle: {fontWeight: 500}
    },
    balance: {
      label: 'Resulting balance',
      width: 0.5,
      labelStyle: {justifyContent: 'flex-end'},
      valueCellStyle: {justifyContent: 'flex-end'},
      valueStyle: {fontWeight: 500}
    },
    actions: {
      width: 0.5,
      switchable: false,
    }
  }

  constructor(private transactionService: TransactionService) {
    super()
  }

  ngOnInit(): void {
    this.loadList()
  }

  loadList() {
    this.loading = true
    this.subs.add(
      this.transactionService.getAll().subscribe(
        data => {
          this.loading = false
          this.items = data
        }
      )
    )
  }

}
