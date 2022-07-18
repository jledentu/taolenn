export default class Emitter {
    #emitter: EventTarget;

    constructor() {
        this.#emitter = new EventTarget();
    }

    on(eventName: string, listener) {
        return this.#emitter.addEventListener(eventName, listener);
    }

    off(eventName: string, listener) {
        return this.#emitter.removeEventListener(eventName, listener);
    }

    protected emit(eventName: string, detail?) {
        return this.#emitter.dispatchEvent(
            new CustomEvent(eventName, { detail, cancelable: true })
        );
    }
}