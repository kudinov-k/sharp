import { Observable } from 'rxjs'
import { RequestObject } from './request'

export namespace Table {
  export interface Column {
    label?: string
    /**
     * Use function if you need do something with value before display.
     * If need add html use `ng-template` as child in `table-list` component with directive `tableField`
     * @param value of item field
     * @param item instance with all fields
     */
    value?: (value: any, item?: any) => void
    labelStyle?: {}
    valueStyle?: {}
    valueCellStyle?: {}
    valueClasses?: string[]
    labelClasses?: string[]
    filterRequestKey?: string
    switchable?: boolean
    defaultSwitchOff?: boolean
    hovered?: boolean
    /**
     * width in grid fr value, 0.1 0.2 ... allowed
     */
    width?: number
    /**
     * min width in pixel
     * default 80
     */
    minWidth?: number
    /**
     * if true text will be wrapped when it's doesn't fit, else it will ellipsis
     * default false
     */
    wrapText?: boolean

    filterValuesObservable?: (r: RequestObject) => Observable<any>
    filterValuesRequestObject?: RequestObject
    filterPopupPosition?: 'left' | 'right'
    sortable?: boolean
  }

  export interface Columns {
    [key: string]: Column
  }
}
