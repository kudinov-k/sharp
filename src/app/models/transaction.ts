import { Expose, Type } from '../core/class-transformer'

export namespace Transaction {

  export class Model {
    @Expose()
    id: number

    @Expose()
    @Type(() => Date)
    date: Date

    @Expose()
    username: string

    @Expose()
    amount: number

    @Expose()
    balance: number
  }

  export class TransactionsResponse {
    @Type(() => Model)// tslint:disable-next-line:variable-name
    trans_token: Model[]
  }

}
