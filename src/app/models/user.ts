import { Expose } from '../core/class-transformer'

export namespace User {

  export class General {
    @Expose()
    id: number

    @Expose()
    name: string
  }

  export class Model extends General {
    @Expose()
    email: string

    @Expose()
    balance: number
  }

  export class Token {
    @Expose({name: 'id_token'})
    token: string
  }

}
