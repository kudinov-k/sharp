import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { plainToClass } from '../core/class-transformer'
import Paths from '../misc/paths'
import { Transaction } from '../models/transaction'
import { ApiService } from './api.service'

@Injectable()
export class TransactionService {

  constructor(private apiService: ApiService) {
  }

  getAll(): Observable<Transaction.Model[]> {
    return this.apiService.get<Transaction.TransactionsResponse>(Paths.Transaction.getAll).pipe(
      map(data => plainToClass(Transaction.Model, data.trans_token, {excludeExtraneousValues: true})),
      tap(data => data.sort((a, b) => b.date.getTime() - a.date.getTime()))
    )
  }

  addTransaction(body: any): Observable<Transaction.Model> {
    return this.apiService.post(Paths.Transaction.add, body).pipe(
      map(data => plainToClass(Transaction.Model, data['trans_token'], {excludeExtraneousValues: true}))
    )
  }

}
