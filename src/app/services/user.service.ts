import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { plainToClass } from '../core/class-transformer'
import Paths from '../misc/paths'
import { RequestObject } from '../misc/request'
import { User } from '../models/user'
import { ApiService } from './api.service'
import { AuthService } from './auth.service'

@Injectable()
export class UserService {

  constructor(private apiService: ApiService,
              private authService: AuthService) {
  }

  getAll(request: RequestObject): Observable<User.General[]> {
    const filter = request.search['searchString']
    return this.apiService.post<User.General[]>(Paths.User.getAll, {filter}).pipe(
      map(data => plainToClass(User.General, data, {excludeExtraneousValues: true}))
    )
  }

  getMe() {
    this.apiService.get<User.Model>(Paths.User.getMe).pipe(
      catchError(ignore => {
        return of(null)
      }),
      map(data => {
        return plainToClass(User.Model, data['user_info_token'], {excludeExtraneousValues: true})
      })
    ).subscribe(
      user => {
        this.authService.currentUser.next(user)
      }
    )
  }

  addUser(body: any): Observable<User.Token> {
    return this.apiService.post(Paths.User.add, body).pipe(
      map(data => plainToClass(User.Token, data, {excludeExtraneousValues: true}))
    )
  }

}
