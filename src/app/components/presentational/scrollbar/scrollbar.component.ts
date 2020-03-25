import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core'
import { PerfectScrollbarDirective } from './ngx-perfect-scrollbar'

@Component({
  selector: 'scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrollbarComponent implements OnInit {

  @ViewChild(PerfectScrollbarDirective) perfectScrollbarRef: PerfectScrollbarDirective

  @Input() maxHeight = '100%'
  @Input() hovered = false
  @Input() loading = false
  @Output() scrollToEndHandler = new EventEmitter()

  styles = {}

  constructor(private zone: NgZone) {
  }

  ngOnInit() {
    this.styles = {maxHeight: this.maxHeight}
    if (this.hovered) {
      this.styles = {
        ...this.styles,
        padding: '0 6px 5px 0'
      }
    }
  }

  scrollToEnd() {
    this.zone.run(
      () => this.scrollToEndHandler.emit()
    )
  }
}
