import PerfectScrollbar from '../index'
import cls from '../lib/class-names'
import * as CSS from '../lib/css'
import { env } from '../lib/util'
import updateGeometry from '../update-geometry'

export default function(i: PerfectScrollbar) {
  if (!env.supportsTouch && !env.supportsIePointer) {
    return
  }

  const element = i.element

  function shouldPrevent(deltaX: any, deltaY: any) {
    const scrollTop = Math.floor(element.scrollTop)
    const scrollLeft = element.scrollLeft
    const magnitudeX = Math.abs(deltaX)
    const magnitudeY = Math.abs(deltaY)

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (
        (deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight) ||
        (deltaY > 0 && scrollTop === 0)
      ) {
        // set prevent for mobile Chrome refresh
        return window.scrollY === 0 && deltaY > 0 && env.isChrome
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (
        (deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth) ||
        (deltaX > 0 && scrollLeft === 0)
      ) {
        return true
      }
    }

    return true
  }

  function applyTouchMove(differenceX: any, differenceY: any) {
    element.scrollTop -= differenceY
    element.scrollLeft -= differenceX

    updateGeometry(i)
  }

  let startOffset: any = {}
  let startTime = 0
  const speed: any = {}
  let easingLoop: any = null

  function getTouch(e: any) {
    if (e.targetTouches) {
      return e.targetTouches[0]
    } else {
      // Maybe IE pointer
      return e
    }
  }

  function shouldHandle(e: any) {
    if (e.pointerType && e.pointerType === 'pen' && e.buttons === 0) {
      return false
    }
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true
    }
    if (
      e.pointerType &&
      e.pointerType !== 'mouse' &&
      e.pointerType !== e.MSPOINTER_TYPE_MOUSE
    ) {
      return true
    }
    return false
  }

  function touchStart(e: any) {
    if (!shouldHandle(e)) {
      return
    }

    const touch = getTouch(e)

    startOffset.pageX = touch.pageX
    startOffset.pageY = touch.pageY

    startTime = new Date().getTime()

    if (easingLoop !== null) {
      clearInterval(easingLoop)
    }
  }

  function shouldBeConsumedByChild(target: any, deltaX: any, deltaY: any) {
    if (!element.contains(target)) {
      return false
    }

    let cursor = target

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true
      }

      const style: any = CSS.get(cursor)

      // if deltaY && vertical scrollable
      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        const maxScrollTop = cursor.scrollHeight - cursor.clientHeight
        if (maxScrollTop > 0) {
          if (
            (cursor.scrollTop > 0 && deltaY < 0) ||
            (cursor.scrollTop < maxScrollTop && deltaY > 0)
          ) {
            return true
          }
        }
      }
      // if deltaX && horizontal scrollable
      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        const maxScrollLeft = cursor.scrollWidth - cursor.clientWidth
        if (maxScrollLeft > 0) {
          if (
            (cursor.scrollLeft > 0 && deltaX < 0) ||
            (cursor.scrollLeft < maxScrollLeft && deltaX > 0)
          ) {
            return true
          }
        }
      }

      cursor = cursor.parentNode
    }

    return false
  }

  function touchMove(e: any) {
    if (shouldHandle(e)) {
      const touch = getTouch(e)

      const currentOffset = {pageX: touch.pageX, pageY: touch.pageY}

      const differenceX = currentOffset.pageX - startOffset.pageX
      const differenceY = currentOffset.pageY - startOffset.pageY

      if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
        return
      }

      applyTouchMove(differenceX, differenceY)
      startOffset = currentOffset

      const currentTime = new Date().getTime()

      const timeGap = currentTime - startTime
      if (timeGap > 0) {
        speed.x = differenceX / timeGap
        speed.y = differenceY / timeGap
        startTime = currentTime
      }

      if (shouldPrevent(differenceX, differenceY)) {
        e.preventDefault()
      }
    }
  }

  function touchEnd() {
    if (i.settings.swipeEasing) {
      clearInterval(easingLoop)
      easingLoop = setInterval(() => {
        // if (i.isInitialized) {
        //   clearInterval(easingLoop)
        //   return
        // }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop)
          return
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop)
          return
        }

        applyTouchMove(speed.x * 30, speed.y * 30)

        speed.x *= 0.8
        speed.y *= 0.8
      }, 10)
    }
  }

  if (env.supportsTouch) {
    i.eventManager.bind(element, 'touchstart', touchStart)
    i.eventManager.bind(element, 'touchmove', touchMove)
    i.eventManager.bind(element, 'touchend', touchEnd)
  } else if (env.supportsIePointer) {
    // @ts-ignore
    if (window.PointerEvent) {
      i.eventManager.bind(element, 'pointerdown', touchStart)
      i.eventManager.bind(element, 'pointermove', touchMove)
      i.eventManager.bind(element, 'pointerup', touchEnd)
    } else {
      // @ts-ignore
      if (window.MSPointerEvent) {
        i.eventManager.bind(element, 'MSPointerDown', touchStart)
        i.eventManager.bind(element, 'MSPointerMove', touchMove)
        i.eventManager.bind(element, 'MSPointerUp', touchEnd)
      }
    }
  }
}
