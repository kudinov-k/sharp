import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { KitModule } from '../presentational/kit.module'
import { CheckboxComponent } from './checkbox/checkbox.component'
import { InputComponent } from './input/input.component'
import { NgSelectModule } from './select/ng-select.module'

@NgModule({
  declarations: [
    InputComponent,
    CheckboxComponent
  ],
  imports: [
    CommonModule,
    KitModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [
    InputComponent,
    CheckboxComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class FormKitModule {
}
