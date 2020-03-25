import { Promise } from 'q'

const unescapedHTMLExp = /[&<>"']/g
const hasUnescapedHTMLExp = RegExp(unescapedHTMLExp.source)
const htmlEscapes: any = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
}

export function escapeHTML(str: string) {
  return (str && hasUnescapedHTMLExp.test(str)) ? str.replace(unescapedHTMLExp, chr => htmlEscapes[chr]) : str
}

export function isDefined(value: any) {
  return value !== undefined && value !== null
}

export function isObject(value: any) {
  return typeof value === 'object' && isDefined(value)
}

export function isPromise(value: any) {
  return value instanceof Promise
}

export function isFunction(value: any) {
  return value instanceof Function
}
