/**
 * @author  Uladzimir Ambrazhey, <uladzimir.ambrazhey@gmail.com>
 */

import axios from 'axios';
import OCparseOptions from './oc-parse-options';
import OCEvent from './oc-event-system';
import OCUpdateDOM from './oc-update-dom';

export default class OCRequest {
  constructor() {
    this.obResponseStore = undefined;
    this.obOptions = {};
  }

  sendData(handler, options) {
    this.requestPreparing(handler, options);

    if (!this.obOptions.confirm) return;

    axios(this.obOptions)
      .then((response) => {
        this.handleResponse(response, options);
      })
      .catch((error) => {
        this.constructor.error(error, this.obOptions);
      })
      .then(() => {
        this.constructor.complete(this.obResponseStore, this.obOptions);
      });
  }

  requestPreparing(handler, options) {
    const parseOptionsInstance = new OCparseOptions(handler, options);

    this.obOptions = parseOptionsInstance.obOptions;

    document.dispatchEvent(OCEvent.ocBeforeRequest(this.obOptions));

    if (options.loading) {
      OCUpdateDOM.show(options.loading);
    }
  }

  handleResponse(response, options) {
    this.obResponseStore = response;

    if (this.obOptions.loading) {
      OCUpdateDOM.hide(options.loading);
    }

    if (this.obOptions.update !== undefined) {
      document.dispatchEvent(OCEvent.ocBeforeUpdate(response));
      this.constructor.initUpdating(this.obOptions.update, response);
      document.dispatchEvent(OCEvent.ocAfterUpdate());
    }
    this.constructor.success(response, this.obOptions);
  }

  static initUpdating(data, response) {
    const updateDOM = new OCUpdateDOM(data, response);

    updateDOM.update();
  }

  static error(error = {}, options = {}) {
    if (options.error) {
      options.error(error);
    }
  }

  static success(response = {}, options = {}) {
    if (options.success) {
      options.success(response);
    }
  }

  static complete(response = {}, options = {}) {
    if (options.complete !== 'undefined') {
      options.complete(response);
    }
  }
}