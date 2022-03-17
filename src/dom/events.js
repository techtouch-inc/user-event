// https://techtouch.atlassian.net/browse/MDN-6316
// @testing-library/user-eventの移植に必要なコードを移植
// https://github.com/testing-library/dom-testing-library/blob/master/src/events.js

import {eventMap, eventAliasMap} from './eventMap'
import {getWindowFromNode} from './getWindowFromNode'

function fireEvent(element, event) {
  if (!event) {
    throw new Error(`Unable to fire an event - please provide an event object.`)
  }
  if (!element) {
    throw new Error(
      `Unable to fire a "${event.type}" event - please provide a DOM element.`,
    )
  }
  return element.dispatchEvent(event)
}

function createEvent(
  eventName,
  node,
  init,
  {EventType = 'Event', defaultInit = {}} = {},
) {
  if (!node) {
    throw new Error(
      `Unable to fire a "${eventName}" event - please provide a DOM element.`,
    )
  }
  const eventInit = {...defaultInit, ...init}
  const {target: {value, files, ...targetProperties} = {}} = eventInit
  if (value !== undefined) {
    setNativeValue(node, value)
  }
  if (files !== undefined) {
    // input.files is a read-only property so this is not allowed:
    // input.files = [file]
    // so we have to use this workaround to set the property
    Object.defineProperty(node, 'files', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: files,
    })
  }
  Object.assign(node, targetProperties)
  const window = getWindowFromNode(node)
  const EventConstructor = window[EventType] || window.Event
  let event
  /* istanbul ignore else  */
  if (typeof EventConstructor === 'function') {
    event = new EventConstructor(eventName, eventInit)
  } else {
    // IE11 polyfill from https://github.com/getsentry/sentry-javascript/blob/5ed31354/packages/utils/src/is.ts#L52-L54
    try {
      event = window.document.createEvent(EventType)
    } catch (err) {
      if (
        Object.prototype.toString.call(err) === '[object DOMException]' &&
        err.message === 'NotSupportedError'
      ) {
        event = window.document.createEvent('Event')
      } else {
        throw err
      }
    }
    const {bubbles, cancelable, detail, ...otherInit} = eventInit
    if (EventType === 'MouseEvent') {
      const _detail = {...detail, ...otherInit}
      event.initMouseEvent(
        eventName,
        bubbles,
        cancelable,
        getWindowFromNode(node),
        0,
        _detail.screenX || 0,
        _detail.screenY || 0,
        _detail.clientX || 0,
        _detail.clientY || 0,
        _detail.ctrlKey || false,
        _detail.altKey || false,
        _detail.shiftKey || false,
        _detail.metaKey || false,
        _detail.button || 0,
        _detail.relatedTarget || null,
      )
    } else {
      event.initEvent(eventName, bubbles, cancelable, detail)
      Object.keys(otherInit).forEach(eventKey => {
        event[eventKey] = otherInit[eventKey]
      })
    }
  }

  // DataTransfer is not supported in jsdom: https://github.com/jsdom/jsdom/issues/1568
  const dataTransferProperties = ['dataTransfer', 'clipboardData']
  dataTransferProperties.forEach(dataTransferKey => {
    const dataTransferValue = eventInit[dataTransferKey]

    if (typeof dataTransferValue === 'object') {
      /* istanbul ignore if  */
      if (typeof window.DataTransfer === 'function') {
        Object.defineProperty(event, dataTransferKey, {
          value: Object.getOwnPropertyNames(dataTransferValue).reduce(
            (acc, propName) => {
              Object.defineProperty(acc, propName, {
                value: dataTransferValue[propName],
              })
              return acc
            },
            new window.DataTransfer(),
          ),
        })
      } else {
        Object.defineProperty(event, dataTransferKey, {
          value: dataTransferValue,
        })
      }
    }
  })

  return event
}

Object.keys(eventMap).forEach(key => {
  const {EventType, defaultInit} = eventMap[key]
  const eventName = key.toLowerCase()

  createEvent[key] = (node, init) =>
    createEvent(eventName, node, init, {EventType, defaultInit})
  fireEvent[key] = (node, init) => fireEvent(node, createEvent[key](node, init))
})

// function written after some investigation here:
// https://github.com/facebook/react/issues/10135#issuecomment-401496776
function setNativeValue(element, value) {
  const {set: valueSetter} =
    Object.getOwnPropertyDescriptor(element, 'value') || {}
  const prototype = Object.getPrototypeOf(element)
  const {set: prototypeValueSetter} =
    Object.getOwnPropertyDescriptor(prototype, 'value') || {}
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value)
  } /* istanbul ignore next (I don't want to bother) */ else if (valueSetter) {
    valueSetter.call(element, value)
  } else {
    throw new Error('The given element does not have a value setter')
  }
}

Object.keys(eventAliasMap).forEach(aliasKey => {
  const key = eventAliasMap[aliasKey]
  fireEvent[aliasKey] = (...args) => fireEvent[key](...args)
})

export {fireEvent, createEvent}

/* eslint complexity:["error", 9] */
