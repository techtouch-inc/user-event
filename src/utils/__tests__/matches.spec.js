import {matches} from '../matches'

const original = Element.prototype.matches
describe('matches', () => {
  beforeEach(() => {
    delete Element.prototype.matches
    document.body.innerHTML = '<article class="foo bar baz"></article>'
  })
  afterEach(() => {
    Element.prototype.matches = original
    document.body.innerHTML = ''
  })

  test('正しく取得できる（オリジナルがある場合）', () => {
    Element.prototype.matches = original
    const el = document.querySelector('.foo.bar.baz')
    expect(el).toBeTruthy()
    expect(matches(el, '.foo.bar.baz')).toBeTruthy()
  })

  test('正しく取得できる（オリジナルがない場合）', () => {
    const el = document.querySelector('.foo.bar.baz')
    expect(el).toBeTruthy()
    expect(matches(el, '.foo.bar.baz')).toBeTruthy()
  })
})
