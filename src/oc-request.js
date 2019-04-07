/**
 * @author  Uladzimir Ambrazhey, <uladzimir.ambrazhey@gmail.com>
 */

import axios from 'axios';
import OCparseOptions from './oc-parse-options';
import OCEvent from './oc-event-system';
import OCUpdateDOM from './oc-update-dom';

export default class OCRequest {
  constructor() {
    this.responseStore = undefined;
  }

  send(handler, options) {
    const parseOptionsInstance = new OCparseOptions(handler, options);

    this.obOptions = parseOptionsInstance.obOptions;

    document.dispatchEvent(OCEvent.ocBeforeRequest(this.obOptions));

    axios(this.obOptions)
      .then((response) => {
        this.responseStore = response;

        if (this.obOptions.update !== undefined) {
          document.dispatchEvent(OCEvent.ocBeforeUpdate(response));
          this.constructor.initUpdating(this.obOptions.update, response);
        }
        this.constructor.success(response, this.obOptions);
      })
      .catch((error) => {
        this.constructor.error(error, this.obOptions);
      })
      .then(() => {
        this.constructor.complete(this.responseStore, this.obOptions);
      });
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
