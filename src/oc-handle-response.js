import OCEvent from './oc-event-system';
import OCUpdateDOM from './oc-update-dom';

const redirectKey = 'X_OCTOBER_REDIRECT';
let obResponseStore;

const initUpdating = (data, response) => {
  const updateDOM = new OCUpdateDOM(data, response);

  updateDOM.update();
};

export const errorFunc = (error = {}, options = {}) => {
  if (options.error) {
    options.error(error);
  }
};

const success = (response = {}, options = {}) => {
  if (options.success) {
    options.success(response);
  }
};

export const completeFunc = (response = {}, options = {}) => {
  if (options.complete === undefined) return;

  options.complete(response);
};


const handleRedirect = (response) => {
  const url = response.data[redirectKey].trim();

  if (url !== 'undefined') {
    window.location.href = url;
  }
};

const handleResponse = (response, options, globalOptions) => {
  obResponseStore = response;

  if (globalOptions.loading) {
    OCUpdateDOM.hide(options.loading);
  }

  if (globalOptions.update !== undefined) {
    document.dispatchEvent(OCEvent.ocBeforeUpdate(response));
    initUpdating(globalOptions.update, response);
    document.dispatchEvent(OCEvent.ocAfterUpdate());
  }

  if (globalOptions.redirect) {
    handleRedirect(response);
  }

  success(response, globalOptions);
};


export default handleResponse;
