class State {
    #max = 0;
    #counter = 0;

    constructor(max = 0) {
        this.max = max;
    }

    get max() {
        return this.#max ?? 0;
    }

    set max(value) {
        this.#max = value;
    }

    get counter() {
        return this.#counter;
    }

    set counter(value) {
        if (!Number.isFinite(value)) {
            return;
        }
        this.#counter = this.#counter + value;
    }

    get isFileSizeAcceptable() {
        if ([this.#counter, this.#max].some(v => !Number.isFinite(v))) {
            return false;
        }
        return this.#counter < this.#max;
    }
}

const state = new State();

export default state;
