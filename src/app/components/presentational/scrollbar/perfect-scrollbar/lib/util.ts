import * as CSS from './css'
import * as DOM from './dom'

export function toInt(x: any) {
  return parseInt(x, 10) || 0
}

export function isEditable(el: any) {
  return (
    DOM.matches(el, 'input,[contenteditable]') ||
    DOM.matches(el, 'select,[contenteditable]') ||
    DOM.matches(el, 'textarea,[contenteditable]') ||
    DOM.matches(el, 'button,[contenteditable]')
  )
}

export function outerWidth(element: any) {
  const styles = CSS.get(element)
  return (
    toInt(styles.width) +
    toInt(styles.paddingLeft) +
    toInt(styles.paddingRight) +
    toInt(styles.borderLeftWidth) +
    toInt(styles.borderRightWidth)
  )
}

export const env = {
  isWebKit:
    typeof document !== 'undefined' &&
    'WebkitAppearance' in document.documentElement.style,
  supportsTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      // @ts-ignore
      ('maxTouchPoints' in window.navigator &&
        // @ts-ignore
        window.navigator.maxTouchPoints > 0) ||
      // @ts-ignore
      (window.DocumentTouch && document instanceof window.DocumentTouch)),
  supportsIePointer:
    typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
  isChrome:
    typeof navigator !== 'undefined' &&
    /Chrome/i.test(navigator && navigator.userAgent)
}
