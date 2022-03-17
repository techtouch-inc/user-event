import {matches} from './matches'

export const closest = (element, selector) => {
  if (element?.closest) return element.closest(selector)

  var el = element
  do {
    if (matches(el, selector)) return el
    el = el.parentElement || el.parentNode
  } while (el !== null && el.nodeType === 1)
  return null
}
