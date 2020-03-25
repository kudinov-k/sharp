import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AuthWrapperComponent } from './auth-wrapper/auth-wrapper.component'
import { BtnFlatComponent } from './btn-flat/btn-flat.component'
import { ErrorMessageComponent } from './error-message/error-message.component'
import { LoadingProcessComponent } from './loading-process/loading-process.component'
import { NoDataComponent } from './no-data/no-data.component'
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from './scrollbar/ngx-perfect-scrollbar'
import { ScrollbarComponent } from './scrollbar/scrollbar.component'
import { SvgIconComponent } from './svg-icon/svg-icon.component'

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  swipeEasing: true,
  minScrollbarLength: 20
}

@NgModule({
  declarations: [
    BtnFlatComponent,
    ErrorMessageComponent,
    LoadingProcessComponent,
    NoDataComponent,
    ScrollbarComponent,
    SvgIconComponent,
    AuthWrapperComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PerfectScrollbarModule,
  ],
  exports: [
    CommonModule,
    BtnFlatComponent,
    ErrorMessageComponent,
    LoadingProcessComponent,
    NoDataComponent,
    ScrollbarComponent,
    SvgIconComponent,
    AuthWrapperComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class KitModule {
}
