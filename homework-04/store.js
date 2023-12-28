class State {
    #current = 0;
    #max = 0;

    constructor(current = 0, max = 0) {
        this.current = current;
        this.max = max;
    }

    set max(value) {
        this.#max = value;
    }

    set current(value) {
        this.#current = value;
    }

    get isCurrentSizeLowerMax() {
        if ([this.#current, this.#max].some(v => !Number.isFinite(v))) {
            return false;
        }
        return this.#current < this.#max;
    }
}

const state = new State();

export default state;
