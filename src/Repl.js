import Runtime from './Runtime';

export default class Repl {
  static #WORKER;
  static count = 0;
  #worker;
  #runtime;
  #history = [];
  id;
  scope;

  constructor({
    packages = [],
    scope = 'global',
    workerScript = 'worker.js',
  } = {}) {
    this.packages = packages;
    this.scope = scope === 'local' ? scope : 'global';
    this.workerScript = workerScript;

    // update class state shared between editors
    Repl.count += 1;
    this.id = Repl.count;
  }

  get history() {
    return this.#history.join('\n');
  }

  get runCount() {
    return this.#history.length;
  }

  get worker() {
    return this.#worker;
  }

  init(restart = false) {
    // initialize web worker for proper Python runtime scope/context

    if (this.scope === 'local') {
      this.#worker = new Worker(this.workerScript);
    } else {
      // check is class wide shared worker is defined yet
      if (restart) {
        Repl.#WORKER = new Worker(this.workerScript);
      } else {
        Repl.#WORKER = Repl.#WORKER || new Worker(this.workerScript);
      }

      this.#worker = Repl.#WORKER;
    }

    this.#runtime = new Runtime(this.#worker, this.id);

    const promise = new Promise((resolve, reject) => {
      // initialize Pyodide and preload packages
      this.#runtime
        .init(this.packages)
        .then((res) => {
          if (res === this.#runtime) {
            resolve(this);
          }
        })
        .catch((res) => {
          reject(res);
        });
    });

    return promise;
  }

  run(code) {
    const promise = new Promise((resolve, reject) => {
      this.#history.push(code);

      this.#runtime
        .exec(code)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });

    return promise;
  }

  restart(confirm = true) {
    if (confirm) {
      const result = window.confirm(
        'Are you sure you want to restart the Python session? All variables in the session (in all editors) will be reset',
      );
      if (!result) {
        return false;
      }
    }

    console.log('Restarting Python session...');
    this.#history.push('RESTART SESSION\n');
    this.#worker.terminate();

    const promise = new Promise((resolve, reject) => {
      this.init(true)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });

    return promise;
  }
}
