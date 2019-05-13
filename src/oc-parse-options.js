/**
 * @author  Uladzimir Ambrazhey, <uladzimir.ambrazhey@gmail.com>
 */

import msg from './oc-request-message';

export default class OCparseOptions {
  constructor(handler, options = {}) {
    if (handler === undefined) {
      this.constructor.showError(msg.handlerUndefined);
    }

    if (!handler.match(/^(?:\w+:{2})?on*/)) {
      this.constructor.showError(msg.HandlerNameInvalid);
    }

    this.obOptions = this.setOptions(handler, options);
  }

  setRequestHeaders(handler, options) {
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-OCTOBER-REQUEST-HANDLER': handler,
      'X-OCTOBER-REQUEST-PARTIALS': this.extractPartials(options.update),
    };

    if (options.useFlash) {
      headers['X-OCTOBER-REQUEST-FLASH'] = 1;
    }
    return headers;
  }

  extractPartials(obUpdate = {}) {
    if (obUpdate.toString() !== '[object Object]') {
      this.constructor.showError(msg.updateIsObject);
    }

    const arPartial = Object.keys(obUpdate);
    const sPartial = arPartial.join('&');

    return sPartial;
  }

  setOptions(handler, options = {}) {
    const obOptions = {
      url: window.location.href,
      redirect: options.redirect || true,
      method: 'POST',
      withCredentials: true,
      headers: this.setRequestHeaders(handler, options),
      crossDomain: false,
      data: options.data,
      complete: options.complete,
      success: options.success,
      error: options.error,
      update: options.update,
      loading: options.loading,
      files: options.files,
    };

    return obOptions;
  }

  static showError(message) {
    throw new Error(message);
  }
}
