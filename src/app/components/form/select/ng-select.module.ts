import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { KitModule } from '../../presentational/kit.module'
import { NgDropdownPanelComponent } from './ng-dropdown-panel/ng-dropdown-panel.component'
import { NgOptionComponent } from './ng-option/ng-option.component'
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from './ng-select/ng-select.component'
import {
  NgFooterTemplateDirective,
  NgHeaderTemplateDirective,
  NgItemLabelDirective,
  NgLabelTemplateDirective,
  NgLoadingSpinnerTemplateDirective,
  NgLoadingTextTemplateDirective,
  NgMultiLabelTemplateDirective,
  NgNotFoundTemplateDirective,
  NgOptgroupTemplateDirective,
  NgOptionTemplateDirective,
  NgTagTemplateDirective,
  NgTypeToSearchTemplateDirective
} from './ng-templates.directive'
import { DefaultSelectionModelFactory } from './selection-model'

@NgModule({
  declarations: [
    NgDropdownPanelComponent,
    NgOptionComponent,
    NgSelectComponent,
    NgOptgroupTemplateDirective,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgMultiLabelTemplateDirective,
    NgHeaderTemplateDirective,
    NgFooterTemplateDirective,
    NgNotFoundTemplateDirective,
    NgTypeToSearchTemplateDirective,
    NgLoadingTextTemplateDirective,
    NgTagTemplateDirective,
    NgLoadingSpinnerTemplateDirective,
    NgItemLabelDirective
  ],
  imports: [
    CommonModule,
    KitModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    NgDropdownPanelComponent,
    NgOptionComponent,
    NgSelectComponent,
    NgOptgroupTemplateDirective,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgMultiLabelTemplateDirective,
    NgHeaderTemplateDirective,
    NgFooterTemplateDirective,
    NgNotFoundTemplateDirective,
    NgTypeToSearchTemplateDirective,
    NgLoadingTextTemplateDirective,
    NgTagTemplateDirective,
    NgLoadingSpinnerTemplateDirective,
    NgItemLabelDirective
  ],
  providers: [
    {provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory}
  ]
})

export class NgSelectModule {
}
