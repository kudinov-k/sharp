export function div(className: any) {
  const _div = document.createElement('div')
  _div.className = className
  return _div
}

const elMatches =
  typeof Element !== 'undefined' &&
  (Element.prototype.matches ||
    Element.prototype.webkitMatchesSelector ||
    // @ts-ignore
    Element.prototype.mozMatchesSelector ||
    // @ts-ignore
    Element.prototype.msMatchesSelector)

export function matches(element: any, query: any) {
  if (!elMatches) {
    throw new Error('No element matching method supported')
  }

  return elMatches.call(element, query)
}

export function remove(element: any) {
  if (element.remove) {
    element.remove()
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  }
}

export function queryChildren(element: any, selector: any) {
  return Array.prototype.filter.call(element.children, child =>
    matches(child, selector)
  )
}
