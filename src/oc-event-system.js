export default new class OCEventSystem {
  constructor() {
    this.ocBeforeRequestEvent = 'ocBeforeAxiosRequest';
    this.ocBeforeUpdateEvent = 'ocBeforeUpdateEvent';
    this.ocAfterUpdateEvent = 'ocAfterUpdateEvent';
    this.OCBeforeSuccessEvent = 'ocBeforeSuccessEvent';
    this.OCAfterSuccessEvent = 'ocAfterSuccessEvent';
    this.OCBeforeCompleteEvent = 'ocBeforeCompleteEvent';
    this.OCAfterCompleteEvent = 'ocAfterCompleteEvent';
    this.OCBeforeRedirectEvent = 'ocBeforeRedirectEvent';
  }

  ocBeforeRequest(detail) {
    const ocBeforeRequest = new CustomEvent(this.ocBeforeRequestEvent, {
      bubbles: true,
      cancelable: false,
      detail,
    });

    return ocBeforeRequest;
  }

  ocBeforeUpdate(detail) {
    const ocBeforeRequest = new CustomEvent(this.ocBeforeUpdateEvent, {
      bubbles: true,
      cancelable: false,
      detail,
    });

    return ocBeforeRequest;
  }

  ocAfterUpdate() {
    const ocAfterUpdate = new CustomEvent(this.ocAfterUpdateEvent, {
      bubbles: true,
      cancelable: false,
    });

    return ocAfterUpdate;
  }

  OCBeforeSuccessEvent(data) {
    const OCBeforeSuccessEvent = new CustomEvent(this.OCBeforeSuccessEvent, {
      bubbles: true,
      cancelable: false,
      details: data,
    });

    return OCBeforeSuccessEvent;
  }

  OCAfterSuccessEvent(data) {
    const OCAfterSuccessEvent = new CustomEvent(this.OCAfterSuccessEvent, {
      bubbles: true,
      cancelable: false,
      details: data,
    });

    return OCAfterSuccessEvent;
  }

  OCBeforeCompleteEvent(data) {
    const OCBeforeCompleteEvent = new CustomEvent(this.OCBeforeCompleteEvent, {
      bubbles: true,
      cancelable: false,
      details: data,
    });

    return OCBeforeCompleteEvent;
  }

  OCAfterCompleteEvent(data) {
    const OCAfterCompleteEvent = new CustomEvent(this.OCAfterCompleteEvent, {
      bubbles: true,
      cancelable: false,
      details: data,
    });

    return OCAfterCompleteEvent;
  }

  OCBeforeRedirectEvent(data) {
    const OCBeforeRedirectEvent = new CustomEvent(this.OCBeforeRedirectEvent, {
      bubbles: true,
      cancelable: false,
      details: data,
    });

    return OCBeforeRedirectEvent;
  }
}();
