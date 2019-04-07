export default class OCUpdateDOM {
  constructor(data = {}, response = {}) {
    this.response = response;
    this.data = data;
  }

  update() {
    this.parseDataObject(this.data);
  }

  parseDataObject(data) {
    [...Object.keys(data)].forEach((partial) => {
      const selector = data[partial];

      if (typeof selector !== 'string') return;

      this.selectSelectorHandler(partial, selector);
    });
  }

  selectSelectorHandler(partial, selector) {
    switch (selector.charAt(0)) {
      case '@': this.smartInsert('beforeEnd', partial, selector);
        break;

      case '^': this.smartInsert('afterBegin', partial, selector);
        break;

      default: this.replace(partial, selector);
    }
  }

  replace(partial, selector) {
    [...document.querySelectorAll(selector)].forEach((el) => {
      const html = this.response.data[partial];
      const node = el;

      node.innerHTML = html;
    });
  }

  smartInsert(where, partial, selector) {
    [...document.querySelectorAll(selector.substring(1))].forEach((el) => {
      const html = this.response.data[partial];

      el.insertAdjacentHTML(where, html);
    });
  }
}
