// https://techtouch.atlassian.net/browse/MDN-6316
// @testing-library/user-eventの移植に必要なコードを移植
// https://github.com/testing-library/dom-testing-library/blob/master/src/helpers.js

export const getWindowFromNode = (node: Node | Document | Window) => {
  if ('defaultView' in node && node.defaultView) {
    // node is document
    return node.defaultView
  } else if (
    'ownerDocument' in node &&
    node.ownerDocument &&
    node.ownerDocument.defaultView
  ) {
    // node is a DOM node
    return node.ownerDocument.defaultView
  } else if ('window' in node && node.window) {
    // node is window
    return node.window
  } else {
    // The user passed something unusual to a calling function
    throw new Error(`Unable to find the "window" object for the given node.`)
  }
}
