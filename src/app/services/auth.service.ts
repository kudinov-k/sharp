import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { environment } from '../../environments/environment'
import { plainToClass } from '../core/class-transformer'
import Paths from '../misc/paths'
import { User } from '../models/user'

@Injectable()
export class AuthService {

  currentUser = new BehaviorSubject<User.Model | null>(null)

  constructor(private http: HttpClient) {
  }

  login(credentials: any): Observable<User.Token> {
    return this.send('POST', Paths.Auth.login, credentials).pipe(
      map(data => plainToClass(User.Token, data, {excludeExtraneousValues: true})),
      tap(userToken => localStorage.setItem(environment.userTokenStorageKey, userToken.token))
    )
  }

  logout() {
    localStorage.removeItem(environment.userTokenStorageKey)
    this.currentUser.next(null)
  }

  private send(method: string, uri: string, body = {}): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    const options: any = {
      headers,
      observe: 'response',
      body: JSON.stringify(body)
    }

    return this.http.request(method, uri, options).pipe(
      map((response: any) => response.body),
      catchError((reason: HttpErrorResponse) => throwError(reason.error))
    )
  }

}
