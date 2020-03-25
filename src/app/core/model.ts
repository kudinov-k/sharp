import { Filterable } from '../misc/filter'
import { Expose, Type } from './class-transformer'

export namespace BaseModels {
  export class Model implements Filterable {
    @Expose()
    id: number

    @Expose()
    name: string

    filterText(): string {
      return this.name
    }
  }

  export class ModelList {
    @Expose()
    @Type(() => Model)
    list: Model[]

    @Expose()
    totalCount: number
  }
}

