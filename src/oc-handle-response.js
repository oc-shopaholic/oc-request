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
  const url = response[redirectKey];

  if (url !== 'undefined') {
    window.location.href = url.trim();
  }
};

export const handleResponse = (response, options, globalOptions) => {
  obResponseStore = JSON.parse(response.responseText);

  if (globalOptions.loading) {
    OCUpdateDOM.hide(options.loading);
  }
  if (globalOptions.redirect && obResponseStore[redirectKey]) {
    handleRedirect(obResponseStore);
    return;
  }

  if (globalOptions.update !== undefined) {
    document.dispatchEvent(OCEvent.ocBeforeUpdate(obResponseStore));
    initUpdating(globalOptions.update, obResponseStore);
    document.dispatchEvent(OCEvent.ocAfterUpdate());
  }

  success(obResponseStore, globalOptions);
};
