import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Component } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { RouteAnimationsAuth } from './misc/animation'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [RouteAnimationsAuth]
})
export class AppComponent {
  svgSprite: any = ''

  constructor(private http: HttpClient,
              private sanitizer: DomSanitizer) {

    const headers = new HttpHeaders({
      'Content-Type': 'text/plain'
    })
    http.get('assets/sprites/sprite.svg', {
      headers,
      responseType: 'text'
    }).subscribe(res => {
      this.svgSprite = sanitizer.bypassSecurityTrustHtml(res)
    })
  }
}
