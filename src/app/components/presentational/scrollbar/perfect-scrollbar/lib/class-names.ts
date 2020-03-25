const cls = {
  main: 'ps',
  rtl: 'ps__rtl',
  element: {
    thumb: (x: any) => `ps__thumb-${x}`,
    rail: (x: any) => `ps__rail-${x}`,
    consuming: 'ps__child--consume'
  },
  state: {
    focus: 'ps--focus',
    clicking: 'ps--clicking',
    active: (x: any) => `ps--active-${x}`,
    scrolling: (x: any) => `ps--scrolling-${x}`
  }
}

export default cls

/*
 * Helper methods
 */
const scrollingClassTimeout: any = {x: null, y: null}

export function addScrollingClass(i: any, x: any) {
  const classList = i.element.classList
  const className = cls.state.scrolling(x)

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x])
  } else {
    classList.add(className)
  }
}

export function removeScrollingClass(i: any, x: any) {
  scrollingClassTimeout[x] = setTimeout(
    () => i.isAlive && i.element.classList.remove(cls.state.scrolling(x)),
    i.settings.scrollingThreshold
  )
}

export function setScrollingClassInstantly(i: any, x: any) {
  addScrollingClass(i, x)
  removeScrollingClass(i, x)
}
