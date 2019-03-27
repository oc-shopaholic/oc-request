/**
 * @author  Uladzimir Ambrazhey, <uladzimir.ambrazhey@gmail.com>
 */

import axios from 'axios';
import msg from './oc-request-message';

export default class OCRequestCore {
  request(handler, options = {}, form) {
    if (handler === undefined) {
      throw new Error(msg.handlerUndefined);
    }

    if (!handler.match(/^(?:\w+:{2})?on*/)) {
      throw new Error(msg.HandlerNameInvalid);
    }

    this.setOptions(handler, options);
  }

  setRequestHeaders(handler, options) {
    const headers = {
      'X-OCTOBER-REQUEST-HANDLER': handler,
      'X-OCTOBER-REQUEST-PARTIALS': this.extractPartials(options.update),
    };
  }

  extractPartials(obUpdate = {}) {
    if (obUpdate.toString() !== '[object Object]') {
      throw new Error(msg.updateIsObject);
    }

    const arPartial = Object.keys(obUpdate);
    const sPartial = arPartial.join('&');

    return sPartial;
  }

  setOptions(handler, options) {
    console.log(this.setRequestHeaders(handler, options));
  }
}
