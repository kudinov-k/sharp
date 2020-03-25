import clickRail from './handlers/click-rail'
import dragThumb from './handlers/drag-thumb'
import keyboard from './handlers/keyboard'
import wheel from './handlers/mouse-wheel'
import touch from './handlers/touch'
import cls from './lib/class-names'
import * as CSS from './lib/css'
import * as DOM from './lib/dom'
import EventManager from './lib/event-manager'
import { toInt } from './lib/util'
import processScrollDiff from './process-scroll-diff'
import updateGeometry from './update-geometry'

const handlers: any = {
  'click-rail': clickRail,
  'drag-thumb': dragThumb,
  keyboard,
  wheel,
  touch
}

export default class PerfectScrollbar {
  eventManager = new EventManager()
  scrollbarXActive = null
  scrollbarXWidth = null
  scrollbarXLeft = null
  reach: { x: any, y: any }
  settings: any = {
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollingThreshold: 1000,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    suppressScrollX: false,
    suppressScrollY: false,
    swipeEasing: true,
    useBothWheelAxes: false,
    wheelPropagation: true,
    wheelSpeed: 1
  }
  containerWidth: 0
  contentWidth: 0
  containerHeight: 0
  contentHeight: 0
  element: any
  scrollbarX: HTMLDivElement | null
  scrollbarY: HTMLDivElement | null
  scrollbarXRail: HTMLDivElement | null
  scrollbarYRail: HTMLDivElement | null
  negativeScrollAdjustment: number
  ownerDocument: Document
  railXMarginWidth: number
  railYMarginHeight: number
  isAlive: boolean
  scrollbarYRight: number
  isScrollbarXUsingBottom: boolean
  scrollbarXTop: number
  scrollbarYLeft: number
  lastScrollTop: number
  isScrollbarYUsingRight: boolean
  railBorderXWidth: number
  railBorderYWidth: number
  scrollbarXBottom: number
  lastScrollLeft: number
  scrollbarYOuterWidth: number
  scrollbarYTop: number
  railYHeight: number
  railYRatio: number
  scrollbarYActive: number
  scrollbarYHeight: number

  constructor(element: any, userSettings: any = {}) {
    if (typeof element === 'string') {
      element = document.querySelector(element)
    }

    if (!element || !element.nodeName) {
      throw new Error('no element is specified to initialize PerfectScrollbar')
    }

    this.element = element

    this.element.classList.add(cls.main)

    for (const key of Object.keys(userSettings)) {
      this.settings[key] = userSettings[key]
    }
    const focus = () => this.element.classList.add(cls.state.focus)
    const blur = () => this.element.classList.remove(cls.state.focus)

    this.negativeScrollAdjustment = this.isNegativeScroll
      ? this.element.scrollWidth - this.element.clientWidth
      : 0

    this.ownerDocument = this.element.ownerDocument || document

    this.scrollbarXRail = DOM.div(cls.element.rail('x'))
    this.element.appendChild(this.scrollbarXRail)
    this.scrollbarX = DOM.div(cls.element.thumb('x'))
    this.scrollbarXRail.appendChild(this.scrollbarX)
    this.scrollbarX.setAttribute('tabindex', '0')
    this.eventManager.bind(this.scrollbarX, 'focus', focus)
    this.eventManager.bind(this.scrollbarX, 'blur', blur)

    const railXStyle = CSS.get(this.scrollbarXRail)
    this.scrollbarXBottom = parseInt(railXStyle.bottom!, 10)

    if (isNaN(this.scrollbarXBottom)) {
      this.isScrollbarXUsingBottom = false
      this.scrollbarXTop = toInt(railXStyle.top)
    } else {
      this.isScrollbarXUsingBottom = true
    }

    this.railBorderXWidth = toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth)
    // Set rail to display:block to calculate margins
    CSS.set(this.scrollbarXRail, {display: 'block'})
    this.railXMarginWidth = toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight)
    CSS.set(this.scrollbarXRail, {display: ''})

    this.scrollbarYRail = DOM.div(cls.element.rail('y'))
    this.element.appendChild(this.scrollbarYRail)
    this.scrollbarY = DOM.div(cls.element.thumb('y'))
    this.scrollbarYRail.appendChild(this.scrollbarY)
    this.scrollbarY.setAttribute('tabindex', '0')
    this.eventManager.bind(this.scrollbarY, 'focus', focus)
    this.eventManager.bind(this.scrollbarY, 'blur', blur)
    this.scrollbarYActive = 0
    this.scrollbarYHeight = 0
    this.scrollbarYTop = 0
    const railYStyle = CSS.get(this.scrollbarYRail)
    this.scrollbarYRight = parseInt(railYStyle.right!, 10)
    if (isNaN(this.scrollbarYRight)) {
      this.isScrollbarYUsingRight = false
      this.scrollbarYLeft = toInt(railYStyle.left)
    } else {
      this.isScrollbarYUsingRight = true
    }
    this.scrollbarYOuterWidth = 0
    this.railBorderYWidth = toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth)
    CSS.set(this.scrollbarYRail, {display: 'block'})
    this.railYMarginHeight = toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom)
    CSS.set(this.scrollbarYRail, {display: ''})
    this.railYHeight = 0
    this.railYRatio = 0

    this.reach = {
      x:
        this.element.scrollLeft <= 0
          ? 'start'
          : element.scrollLeft >= this.contentWidth! - this.containerWidth!
          ? 'end'
          : null,
      y:
        this.element.scrollTop <= 0
          ? 'start'
          : element.scrollTop >= this.contentHeight! - this.containerHeight!
          ? 'end'
          : null
    }

    this.isAlive = true

    this.settings.handlers.forEach((handlerName: any) => handlers[handlerName](this))

    this.lastScrollTop = Math.floor(this.element.scrollTop) // for onScroll only
    this.lastScrollLeft = this.element.scrollLeft // for onScroll only
    this.eventManager.bind(this.element, 'scroll', (e: any) => this.onScroll(e))
    updateGeometry(this)
  }

  isNegativeScroll = () => {
    const originalScrollLeft = this.element.scrollLeft
    this.element.scrollLeft = -1
    const result = this.element.scrollLeft < 0
    this.element.scrollLeft = originalScrollLeft
    return result
  }

  update() {
    if (!this.isAlive) {
      return
    }

    // Recalculate negative scrollLeft adjustment
    this.negativeScrollAdjustment = this.isNegativeScroll ? this.element.scrollWidth - this.element.clientWidth : 0

    // Recalculate rail margins
    CSS.set(this.scrollbarXRail, {display: 'block'})
    CSS.set(this.scrollbarYRail, {display: 'block'})
    this.railXMarginWidth = toInt(CSS.get(this.scrollbarXRail).marginLeft) + toInt(CSS.get(this.scrollbarXRail).marginRight)
    this.railYMarginHeight = toInt(CSS.get(this.scrollbarYRail).marginTop) + toInt(CSS.get(this.scrollbarYRail).marginBottom)

    // Hide scrollbars not to affect scrollWidth and scrollHeight
    CSS.set(this.scrollbarXRail, {display: 'none'})
    CSS.set(this.scrollbarYRail, {display: 'none'})

    updateGeometry(this)

    processScrollDiff(this, 'top', 0, false, true)
    processScrollDiff(this, 'left', 0, false, true)

    CSS.set(this.scrollbarXRail, {display: ''})
    CSS.set(this.scrollbarYRail, {display: ''})
  }

  onScroll(ignore: any) {
    if (!this.isAlive) {
      return
    }

    updateGeometry(this)
    processScrollDiff(this, 'top', this.element.scrollTop - this.lastScrollTop)
    processScrollDiff(this, 'left', this.element.scrollLeft - this.lastScrollLeft)

    this.lastScrollTop = Math.floor(this.element.scrollTop)
    this.lastScrollLeft = this.element.scrollLeft
  }

  destroy() {
    if (!this.isAlive) {
      return
    }

    this.eventManager.unbindAll()
    DOM.remove(this.scrollbarX)
    DOM.remove(this.scrollbarY)
    DOM.remove(this.scrollbarXRail)
    DOM.remove(this.scrollbarYRail)
    this.removePsClasses()

    // unset elements
    this.element = null
    this.scrollbarX = null
    this.scrollbarY = null
    this.scrollbarXRail = null
    this.scrollbarYRail = null

    this.isAlive = false
  }

  removePsClasses() {
    this.element.className = this.element.className
      .split(' ')
      .filter((name: any) => !name.match(/^ps([-_].+|)$/))
      .join(' ')
  }
}
