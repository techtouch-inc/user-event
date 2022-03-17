// Definitions by: Wu Haotian <https://github.com/whtsky>
interface TypeOpts {
  skipClick?: boolean
  skipAutoClose?: boolean
  delay?: number
  initialSelectionStart?: number
  initialSelectionEnd?: number
}

interface TabUserOptions {
  shift?: boolean
  focusTrap?: Document | Element
}

export type TargetElement = Element | Window

export type FilesArgument = File | File[]

export type UploadInitArgument = {
  clickInit?: MouseEventInit
  changeInit?: Event
}

interface ClickOptions {
  skipHover?: boolean
  clickCount?: number
}

interface UploadOptions {
  applyAccept?: boolean
}

declare const userEvent: {
  clear: (element: TargetElement) => void
  click: (
    element: TargetElement,
    init?: MouseEventInit,
    options?: ClickOptions
  ) => void
  dblClick: (
    element: TargetElement,
    init?: MouseEventInit,
    options?: ClickOptions
  ) => void
  selectOptions: (
    element: TargetElement,
    values: string | string[] | HTMLElement | HTMLElement[],
    init?: MouseEventInit
  ) => void
  deselectOptions: (
    element: TargetElement,
    values: string | string[] | HTMLElement | HTMLElement[],
    init?: MouseEventInit
  ) => void
  upload: (
    element: TargetElement,
    files: FilesArgument,
    init?: UploadInitArgument,
    options?: UploadOptions
  ) => void
  type: <T extends TypeOpts>(
    element: TargetElement,
    text: string,
    userOpts?: T
  ) => T extends { delay: number } ? Promise<void> : void
  tab: (userOpts?: TabUserOptions) => void
  paste: (
    element: TargetElement,
    text: string,
    init?: MouseEventInit,
    pasteOptions?: {
      initialSelectionStart?: number
      initialSelectionEnd?: number
    }
  ) => void
  hover: (element: TargetElement, init?: MouseEventInit) => void
  unhover: (element: TargetElement, init?: MouseEventInit) => void
}

// eslint-disable-next-line import/no-default-export
export default userEvent

export enum specialChars {
  arrowLeft = '{arrowleft}',
  arrowRight = '{arrowright}',
  arrowDown = '{arrowdown}',
  arrowUp = '{arrowup}',
  enter = '{enter}',
  escape = '{esc}',
  delete = '{del}',
  backspace = '{backspace}',
  home = '{home}',
  end = '{end}',
  selectAll = '{selectall}',
  space = '{space}',
  whitespace = ' ',
}
