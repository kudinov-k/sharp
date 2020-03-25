import { environment } from '../../environments/environment'

const base = (rest: string): string => `${environment.serverUrl}/${rest}`
const api = (rest: string): string => base(`api/protected/${rest}`)

class Paths {

  static User = class {
    static add = base('users')
    static getAll = api('users/list')
    static getMe = api('user-info')
  }

  static Transaction = class {
    static getAll = api('transactions')
    static add = api('transactions')
  }

  static Auth = class {
    static login = base('sessions/create')
  }
}

export default Paths
