import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TransactionService } from '../../services/transaction.service'
import { SharedModule } from '../shared.module'
import { NewTransactionComponent } from './new-transaction/new-transaction.component'
import { TransactionListComponent } from './transaction-list/transaction-list.component'

import { TransactionsRoutingModule } from './transactions-routing.module'


@NgModule({
  declarations: [TransactionListComponent, NewTransactionComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    SharedModule
  ],
  providers: [
    TransactionService
  ]
})
export class TransactionsModule {
}
