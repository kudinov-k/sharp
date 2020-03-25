import { Expose, Transform, Type } from '../core/class-transformer'

export interface Filterable {
  id: any

  filterText(): string
}

export type Filters = Map<string, Set<Filterable>>

export class FilterItem implements Filterable {
  id: string

  constructor(value: any) {
    this.id = value
  }

  filterText(): string {
    return this.id
  }
}

export class FilterList {
  @Expose()
  @Type(() => FilterItem)
  @Transform(value => value.map((item: string) => new FilterItem(item)))
  list: FilterItem[]

  @Expose()
  totalCount: number
}
