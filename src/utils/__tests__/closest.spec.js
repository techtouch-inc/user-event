import {closest} from '../closest'

const original = Element.prototype.closest

describe('closest', () => {
  beforeEach(() => {
    delete Element.prototype.closest
    document.body.innerHTML = `
    <article>
      <div id="div-01">Here is div-01
        <div id="div-02">Here is div-02
          <div id="div-03">Here is div-03</div>
        </div>
      </div>
    </article>`
  })
  afterEach(() => {
    Element.prototype.closest = original
    document.body.innerHTML = ''
  })

  test('正しく取得できる（オリジナルがある場合）', () => {
    Element.prototype.closest = original
    const div3 = document.getElementById('div-03')
    expect(div3).toBeTruthy()
    const div1 = closest(div3, '#div-01')
    expect(div1).toBeTruthy()
  })
  test('正しく取得できる（オリジナルがない場合）', () => {
    const div3 = document.getElementById('div-03')
    expect(div3).toBeTruthy()
    const div1 = closest(div3, '#div-01')
    expect(div1).toBeTruthy()
  })

  test('取得できない', () => {
    const div3 = document.getElementById('div-03')
    expect(div3).toBeTruthy()
    const div4 = closest(div3, '#div-04')
    expect(div4).toBeNull()
  })
})
