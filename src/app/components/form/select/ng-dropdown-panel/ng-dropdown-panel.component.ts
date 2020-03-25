import { DOCUMENT } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { fromEvent, merge, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PerfectScrollbarDirective } from '../../../presentational/scrollbar/ngx-perfect-scrollbar'
import { ScrollbarComponent } from '../../../presentational/scrollbar/scrollbar.component'
import { NgOption } from '../ng-select.types'

import { DropdownPosition } from '../ng-select/ng-select.component'

const TOP_CSS_CLASS = 'ng-select-top'
const BOTTOM_CSS_CLASS = 'ng-select-bottom'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'ng-dropdown-panel',
  template: `
    <div *ngIf="headerTemplate" class="ng-dropdown-header">
      <ng-container [ngTemplateOutlet]="headerTemplate"
                    [ngTemplateOutletContext]="{ searchTerm: filterValue }"
      ></ng-container>
    </div>
    <div *ngIf="showSelectedItemInHeader && selectedItems.length" class="ng-dropdown-header">
      <ng-container [ngTemplateOutlet]="selectedOption"
                    [ngTemplateOutletContext]="{ item: selectedItems[0]  }"
      ></ng-container>
    </div>
    <scrollbar #scroll [maxHeight]='maxHeight' (scrollToEndHandler)='scrollToEnd.emit()'>
      <div class="ng-dropdown-panel-items">
        <ng-content></ng-content>
      </div>
    </scrollbar>
    <div *ngIf="footerTemplate" class="ng-dropdown-footer">
      <ng-container [ngTemplateOutlet]="footerTemplate" [ngTemplateOutletContext]="{ searchTerm: filterValue }"></ng-container>
    </div>
    <ng-template #selectedOption let-item='item'>
      {{$any(item)?.label}}
    </ng-template>
  `
})
export class NgDropdownPanelComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() items: NgOption[] = []
  @Input() selectedItems: NgOption[] = []
  @Input() showSelectedItemInHeader = false
  @Input() markedItem: NgOption
  @Input() position: DropdownPosition = 'auto'
  @Input() appendTo: string
  @Input() bufferAmount: any
  @Input() headerTemplate: TemplateRef<any>
  @Input() footerTemplate: TemplateRef<any>
  // @ts-ignore
  @Input() filterValue: string = null
  @Input() isinvalid: boolean
  @Input() maxHeight: string
  @Output() update = new EventEmitter<any[]>()
  @Output() scrollToEnd = new EventEmitter<void>()
  @Output() outsideClick = new EventEmitter<void>()

  @ViewChild('scroll', {read: ScrollbarComponent, static: true}) scrollElementRef: ScrollbarComponent
  /* tslint:disable*/
  private readonly _destroy$ = new Subject<void>()
  private readonly _dropdown: HTMLElement
  private _scrollablePanel: PerfectScrollbarDirective
  private _select: HTMLElement
  private _parent: HTMLElement
  private _currentPosition: DropdownPosition

  constructor(
    private _renderer: Renderer2,
    private _zone: NgZone,
    _elementRef: ElementRef,
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    this._dropdown = _elementRef.nativeElement
  }

  private _itemsLength: number

  private get itemsLength() {
    return this._itemsLength
  }

  private set itemsLength(value: number) {
    if (value !== this._itemsLength) {
      this._itemsLength = value
    }
  }

  @HostListener('mousedown', ['$event'])
  handleMousedown($event: MouseEvent) {
    const target = $event.target as HTMLElement
    if (target.tagName === 'INPUT') {
      return
    }
    $event.preventDefault()
  }

  ngOnInit() {
    // @ts-ignore
    this._select = this._dropdown.parentElement
    this._handleOutsideClick()
    this._appendDropdown()
  }

  ngAfterViewInit(): void {
    this._scrollablePanel = this.scrollElementRef.perfectScrollbarRef
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      const change = changes.items
      this._onItemsChange(change.currentValue, change.firstChange)
    }
  }

  ngOnDestroy() {
    this._destroy$.next()
    this._destroy$.complete()
    this._destroy$.unsubscribe()
    if (this.appendTo) {
      this._renderer.removeChild(this._dropdown.parentNode, this._dropdown)
    }
  }

  scrollTo(option: NgOption) {
    if (!option) {
      return
    }

    const index = this.items.indexOf(option)
    if (index < 0 || index >= this.itemsLength) {
      return
    }

    this._scrollablePanel.scrollToElement(`#${option.htmlId}`)
  }

  adjustPosition() {
    const parent = this._parent.getBoundingClientRect()
    const select = this._select.getBoundingClientRect()
    this._setOffset(parent, select)
  }

  private _handleDropdownPosition() {
    this._currentPosition = this._calculateCurrentPosition(this._dropdown)
    if (this._currentPosition === 'top') {
      this._renderer.addClass(this._dropdown, TOP_CSS_CLASS)
      this._renderer.removeClass(this._dropdown, BOTTOM_CSS_CLASS)
      this._renderer.addClass(this._select, TOP_CSS_CLASS)
      this._renderer.removeClass(this._select, BOTTOM_CSS_CLASS)
    } else {
      this._renderer.addClass(this._dropdown, BOTTOM_CSS_CLASS)
      this._renderer.removeClass(this._dropdown, TOP_CSS_CLASS)
      this._renderer.addClass(this._select, BOTTOM_CSS_CLASS)
      this._renderer.removeClass(this._select, TOP_CSS_CLASS)
    }
    if (this.isinvalid) {
      this._renderer.addClass(this._select, 'border-required')
      this._renderer.addClass(this._dropdown, 'border-required')
    } else {
      this._renderer.removeClass(this._select, 'border-required')
      this._renderer.removeClass(this._dropdown, 'border-required')
    }
    if (this.appendTo) {
      this._updatePosition()
    }

    this._dropdown.style.opacity = '1'
  }

  private _handleOutsideClick() {
    if (!this._document) {
      return
    }

    this._zone.runOutsideAngular(() => {
      merge(
        fromEvent(this._document, 'touchstart', {capture: true}),
        fromEvent(this._document, 'mousedown', {capture: true})
      ).pipe(takeUntil(this._destroy$))
        .subscribe($event => this._checkToClose($event))
    })
  }

  private _checkToClose($event: any) {
    if (this._select.contains($event.target) || this._dropdown.contains($event.target)) {
      return
    }

    const path = $event.path || ($event.composedPath && $event.composedPath())
    if ($event.target && $event.target.shadowRoot && path && path[0] && this._select.contains(path[0])) {
      return
    }

    this._zone.run(() => this.outsideClick.emit())
  }

  private _onItemsChange(items: NgOption[], firstChange: boolean) {
    this.items = items || []
    this.itemsLength = items.length
    this._updateItems(firstChange)
  }

  private _updateItems(firstChange: boolean) {
    this.update.emit(this.items)
    if (!firstChange) {
      return
    }

    this._zone.runOutsideAngular(() => {
      Promise.resolve().then(() => {
        this._handleDropdownPosition()
        this.scrollTo(this.markedItem)
      })
    })
  }

  private _calculateCurrentPosition(dropdownEl: HTMLElement) {
    if (this.position !== 'auto') {
      return this.position
    }
    const selectRect: ClientRect = this._select.getBoundingClientRect()
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const offsetTop = selectRect.top + window.pageYOffset
    const height = selectRect.height
    const dropdownHeight = dropdownEl.getBoundingClientRect().height
    if (offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight) {
      return 'top'
    } else {
      return 'bottom'
    }
  }

  private _appendDropdown() {
    if (!this.appendTo) {
      return
    }
    // @ts-ignore
    this._parent = document.querySelector(this.appendTo)
    if (!parent) {
      throw new Error(`appendTo selector ${this.appendTo} did not found any parent element`)
    }
    this._parent.appendChild(this._dropdown)
  }

  private _updatePosition() {
    const select = this._select.getBoundingClientRect()
    const parent = this._parent.getBoundingClientRect()
    const offsetLeft = select.left - parent.left

    this._setOffset(parent, select)

    this._dropdown.style.left = offsetLeft + 'px'
    this._dropdown.style.width = select.width + 'px'
    this._dropdown.style.minWidth = select.width + 'px'
  }

  private _setOffset(parent: ClientRect, select: ClientRect) {
    const delta = select.height

    if (this._currentPosition === 'top') {
      const offsetBottom = parent.bottom - select.bottom
      this._dropdown.style.bottom = offsetBottom + delta + 'px'
      this._dropdown.style.top = 'auto'
    } else if (this._currentPosition === 'bottom') {
      const offsetTop = select.top - parent.top
      this._dropdown.style.top = offsetTop + delta + 'px'
      this._dropdown.style.bottom = 'auto'
    }
  }
}
