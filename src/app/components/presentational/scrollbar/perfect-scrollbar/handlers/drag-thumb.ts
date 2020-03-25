import PerfectScrollbar from '../index'
import cls, { addScrollingClass, removeScrollingClass } from '../lib/class-names'
import updateGeometry from '../update-geometry'

export default function(i: PerfectScrollbar) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x',
    'scrollbarXRail'
  ])
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y',
    'scrollbarYRail'
  ])
}

function bindMouseScrollHandler(i: PerfectScrollbar,
                                [
                                  containerHeight,
                                  contentHeight,
                                  pageY,
                                  railYHeight,
                                  scrollbarY,
                                  scrollbarYHeight,
                                  scrollTop,
                                  y,
                                  scrollbarYRail
                                ]: any[]
) {
  const element = i.element

  let startingScrollTop: any = null
  let startingMousePageY: any = null
  let scrollBy: any = null

  function mouseMoveHandler(e: any) {
    if (e.touches && e.touches[0]) {
      e[pageY] = e.touches[0].pageY
    }
    element[scrollTop] = startingScrollTop + scrollBy * (e[pageY] - startingMousePageY)
    addScrollingClass(i, y)
    updateGeometry(i)

    e.stopPropagation()
    e.preventDefault()
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y)
    i.scrollbarYRail!.classList.remove(cls.state.clicking)
    i.eventManager.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler)
  }

  function bindMoves(e: any, touchMode = false) {
    startingScrollTop = element[scrollTop]
    if (touchMode && e.touches) {
      e[pageY] = e.touches[0].pageY
    }
    startingMousePageY = e[pageY]
    scrollBy =
      (i.contentHeight! - i.containerHeight!) /
      (i.railYHeight! - i.scrollbarYHeight!)
    if (!touchMode) {
      i.eventManager.bind(i.ownerDocument, 'mousemove', mouseMoveHandler)
      i.eventManager.once(i.ownerDocument, 'mouseup', mouseUpHandler)
      e.preventDefault()
    } else {
      i.eventManager.bind(i.ownerDocument, 'touchmove', mouseMoveHandler)
    }

    i.scrollbarYRail!.classList.add(cls.state.clicking)

    e.stopPropagation()
  }

  i.eventManager.bind(i.scrollbarY, 'mousedown', (e: any) => {
    bindMoves(e)
  })
  i.eventManager.bind(i.scrollbarY, 'touchstart', (e: any) => {
    bindMoves(e, true)
  })
}
