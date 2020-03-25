import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MainMenuComponent } from './main-menu/main-menu.component'
import { MainRoutingModule } from './main-routing.module'
import { MainComponent } from './main/main.component'
import { UserInfoComponent } from './user-info/user-info.component'


@NgModule({
  declarations: [
    MainComponent,
    MainMenuComponent,
    UserInfoComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
  ]
})
export class MainModule {
}
