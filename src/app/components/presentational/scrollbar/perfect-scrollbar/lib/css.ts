export function get(element: any) {
  return getComputedStyle(element)
}

export function set(element: any, obj: any) {
  for (const key of Object.keys(obj)) {
    let val = obj[key]
    if (typeof val === 'number') {
      val = `${val}px`
    }
    element.style[key] = val
  }
  return element
}
