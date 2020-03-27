// mainly a Pyodide wrapper class now
// but will serve as an abstraction around
// any Wasm language module
export default class Runtime {
  #worker;
  id;
  packages;

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

  init(preload = []) {
    // initialize Pyodide and preload packages
    const promise = new Promise((resolve, reject) => {
      this.#worker.onmessage = e => {
        const { action, packages } = e.data;
        if (action === 'loaded') {
          console.log(`Runtime initialized with :${packages}`);
          this.packages = packages;
          resolve(this);
        } else {
          reject(new Error('Runtime initialization failed'));
        }
      };
    });
    this.#worker.postMessage({ action: 'init', packages: preload });
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
