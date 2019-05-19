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
    const data = this.checkDataType(options);

    promisedXHR(xhr, data)
      .then(
        response => handleResponse(response, options, this.obOptions),
        error => errorFunc(error, this.obOptions),
      )
      .then(complete => completeFunc(this.obResponseStore, this.obOptions, complete));
  }

  sendForm(form, handler, options) {
    const { files } = options;
    const fileInput = form.querySelector('[type="file"]');
    const hasFiles = files === true || fileInput;

    const formData = !hasFiles ? this.formSerialize(form) : new FormData(form);

    const xhr = this.requestPreparing(handler, options, true);
    const promisedXHR = this.constructor.promisificationRequest;

    promisedXHR(xhr, formData, true)
      .then(
        response => handleResponse(response, options, this.obOptions),
        error => errorFunc(error, this.obOptions),
      )
      .then(complete => completeFunc(this.obResponseStore, this.obOptions, complete));
  }

  formSerialize(form) {
    const arr = [];
    const { elements } = form;

    for (let i = 0; i < elements.length; i += 1) {
      const input = elements[i];
      const {
        name, type, checked, value,
      } = input;

      const arrUnSerializedElmsType = ['file', 'reset', 'submit', 'button'];

      if (name && type.indexOf(arrUnSerializedElmsType) === -1) {
        if (type === 'select-multiple') {
          const selected = [...input.options].filter(k => k.selected);

          selected.forEach(j => this.constructor.addSerializedItems(arr, name, selected[j]));
        } else if ((type !== 'checkbox' && type !== 'radio') || checked) {
          this.constructor.addSerializedItems(arr, name, value);
        }
      }
    }

    return arr.join('&');
  }

  static addSerializedItems(arrSerialize, name, value) {
    return arrSerialize.push(`${(name)}=${(value)}`);
  }

  checkDataType(options) {
    const { files } = options;
    const { data } = this.obOptions;

    const obData = files !== true ? data : this.constructor.makeFormDataObj(data);

    return obData;
  }

  static makeFormDataObj(data) {
    const formData = new FormData();

    Object.keys(data).forEach(i => formData.append(i, data[i]));

    return formData;
  }

  static promisificationRequest(obRequest, data, isString = false) {
    return new Promise((resolve, reject, complete) => {
      const xhr = obRequest;
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(xhr);
        } else {
          const error = new Error(xhr.statusText);
          error.code = xhr.status;
          reject(error);
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error(OCMessage.requestError));
      });

      xhr.loadend = () => {
        complete(xhr);
      };

      const dataForSend = !isString ? JSON.stringify(data) : data;
      xhr.send(dataForSend);
    });
  }

  static xhrConstructor(method, url, obHeaders) {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    Object.keys(obHeaders).forEach(i => xhr.setRequestHeader(i, obHeaders[i]));

    return xhr;
  }

  requestPreparing(handler, options, isFormData = false) {
    if (isFormData) {
      options.files = true; // eslint-disable-line no-param-reassign
    }
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
