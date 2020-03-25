import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NewTransactionComponent } from './new-transaction/new-transaction.component'
import { TransactionListComponent } from './transaction-list/transaction-list.component'


const routes: Routes = [
  {path: '', redirectTo: 'history', pathMatch: 'full'},
  {path: 'history', component: TransactionListComponent},
  {path: 'new', component: NewTransactionComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {
}
