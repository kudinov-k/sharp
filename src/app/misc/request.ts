import { environment } from '../../environments/environment'

export interface Sort {
  sortBy: string
  sortDirection: 'ASC' | 'DESC'
}

export interface RequestObjectData {
  page?: {
    offset: number,
    limit: number
  }
  search?: { [key: string]: any }
  sort?: Sort
}

export class RequestObject implements RequestObjectData {
  page: {
    offset: number,
    limit: number
  }
  search: { [key: string]: any } = {}
  sort?: Sort

  constructor(data?: RequestObjectData) {
    this.page = data && data.page ? data.page : {offset: 0, limit: environment.pageLimit}
    this.sort = data && data.sort
    this.search = data && data.search ? data.search : {}
  }

  toJson() {
    const request: any = {}
    if (this.search && Object.keys(this.search).length) {
      request['searchRequestDto'] = this.search
    }
    if (this.page) {
      request['pageRequestDto'] = this.page
    }

    if (this.sort) {
      request['sortRequestDto'] = this.sort
    }
    return request
  }
}
