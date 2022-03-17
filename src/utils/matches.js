export const matches = (element, selectors) => {
  if (!element) return element
  return !element.matches
    ? element?.msMatchesSelector
      ? /* istanbul ignore next reason: IE only */
        element.msMatchesSelector(selectors)
      : element.webkitMatchesSelector(selectors)
    : element.matches(selectors)
}
