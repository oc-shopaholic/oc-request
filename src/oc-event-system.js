export default new class OCEventSystem {
  constructor() {
    this.ocBeforeRequestEvent = 'ocBeforeAxiosRequest';
    this.ocBeforeUpdateEvent = 'ocBeforeUpdateEvent';
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
}();
