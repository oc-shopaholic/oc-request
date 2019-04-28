/**
 * @author  Uladzimir Ambrazhey, <uladzimir.ambrazhey@gmail.com>
 */

import OCParseOptions from './oc-parse-options';
import OCMessage from './oc-request-message';
import OCUpdateDOM from './oc-update-dom';
import { handleResponse, errorFunc, completeFunc } from './oc-handle-response';

export default new class OCRequest {
  constructor() {
    this.obResponseStore = undefined;
    this.obOptions = {};
  }

  sendData(handler, options) {
    const xhr = this.requestPreparing(handler, options);
    const promisedXHR = this.constructor.promisificationRequest;
    promisedXHR(xhr, this.obOptions.data)
      .then(
        response => handleResponse(response, this.obOptions, options),
        error => errorFunc(error, this.obOptions),
      )
      .then(complete => completeFunc(this.obResponseStore, this.obOptions, complete));
  }

  static promisificationRequest(obRequest, data) {
    return new Promise((resolve, reject, complete) => {
      const xhr = obRequest;
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr);
        } else {
          const error = new Error(xhr.statusText);
          error.code = xhr.status;
          reject(error);
        }
      };

      xhr.onerror = () => {
        reject(new Error(OCMessage.requestError));
      };

      xhr.loadend = () => {
        complete(xhr);
      };
      xhr.send(JSON.stringify(data));
    });
  }

  static xhrConstructor(method, url, obHeaders) {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    Object.keys(obHeaders).forEach(i => xhr.setRequestHeader(i, obHeaders[i]));

    return xhr;
  }

  requestPreparing(handler, options) {
    const parseOptionsInstance = new OCParseOptions(handler, options);

    this.obOptions = parseOptionsInstance.obOptions;

    const {
      method, url, headers, withCredentials,
    } = this.obOptions;

    const xhr = this.constructor.xhrConstructor(method, url, headers);
    xhr.withCredentials = withCredentials;

    if (options.loading) {
      OCUpdateDOM.show(options.loading);
    }

    return xhr;
  }
}();

