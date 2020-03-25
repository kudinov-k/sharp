import { NgModule } from '@angular/core'
import { FormKitModule } from '../../components/form/form.module'
import { KitModule } from '../../components/presentational/kit.module'

import { AuthRoutingModule } from './auth-routing.module'
import { LoginComponent } from './login/login.component'
import { LogoutComponent } from './logout/logout.component'
import { RegistrationComponent } from './registration/registration.component'


@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegistrationComponent
  ],
  imports: [
    KitModule,
    FormKitModule,
    AuthRoutingModule
  ]
})
export class AuthModule {
}
