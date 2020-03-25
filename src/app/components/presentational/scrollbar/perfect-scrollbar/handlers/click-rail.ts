import PerfectScrollbar from '../index'
import updateGeometry from '../update-geometry'

export default function(i: PerfectScrollbar) {

  i.eventManager.bind(i.scrollbarY, 'mousedown', (e: any) => e.stopPropagation())
  i.eventManager.bind(i.scrollbarYRail, 'mousedown', (e: any) => {
    const positionTop = e.pageY - window.pageYOffset - i.scrollbarYRail!.getBoundingClientRect().top
    const direction = positionTop > i.scrollbarYTop! ? 1 : -1

    i.element.scrollTop += direction * i.containerHeight!
    updateGeometry(i)

    e.stopPropagation()
  })

  i.eventManager.bind(i.scrollbarX, 'mousedown', (e: any) => e.stopPropagation())
  i.eventManager.bind(i.scrollbarXRail, 'mousedown', (e: any) => {
    const positionLeft =
      e.pageX -
      window.pageXOffset -
      i.scrollbarXRail!.getBoundingClientRect().left
    const direction = positionLeft > i.scrollbarXLeft! ? 1 : -1

    i.element.scrollLeft += direction * i.containerWidth!
    updateGeometry(i)

    e.stopPropagation()
  })
}
