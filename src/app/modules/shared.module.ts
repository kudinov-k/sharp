import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormKitModule } from '../components/form/form.module'
import { KitModule } from '../components/presentational/kit.module'
import { TableModule } from '../components/table/table.module'


@NgModule({
  exports: [
    CommonModule,
    TableModule,
    KitModule,
    FormKitModule,
  ],
  imports: [
    CommonModule,
    TableModule,
    KitModule,
    FormKitModule,
  ]
})
export class SharedModule {
}
