// mainly a Pyodide wrapper class now
// but will serve as an abstraction around
// any Wasm language module
export default class Runtime {
  #worker;
  id;

  constructor(worker, id) {
    this.#worker = worker;
    this.id = id;

    // attach web worker callbacks
    this.#worker.onerror = e => {
      console.log(
        `Error in Pyodide worker ${this.id} at ${e.filename}, Line: ${e.lineno}, ${e.message}`
      );
    };
  }

  init() {
    // initialize Pyodide
    const promise = new Promise((resolve, reject) => {
      this.#worker.onmessage = e => {
        const { action } = e.data;
        if (action === 'initialized') {
          resolve(this);
        } else {
          reject(new Error('Runtime initialization failed'));
        }
      };
    });
    this.#worker.postMessage({ action: 'init' });
    return promise;
  }

  load(preload = []) {
    // preload packages
    const promise = new Promise((resolve, reject) => {
      this.#worker.onmessage = e => {
        const { action } = e.data;
        if (action === 'loaded') {
          resolve(this);
        } else {
          reject(new Error('Package preloading failed'));
        }
      };
    });
    this.#worker.postMessage({ action: 'load', packages: preload });
    return promise;
  }

  exec(code) {
    const promise = new Promise((resolve, reject) => {
      this.#worker.onmessage = e => {
        const { action, results } = e.data;
        if (action === 'return') {
          resolve(results);
        } else if (action === 'error') {
          reject(results);
        } else {
          reject(new Error('Unknown Pyodide worker response'));
        }
      };
    });

    this.#worker.postMessage({
      action: 'exec',
      code
    });

    return promise;
  }
}
