import Runtime from './Runtime'; // eslint-disable-line no-unused-vars
import Result from './Result';
import workerTemplate from './worker';

export default class Repl {
  static #WORKER;
  static count = 0;
  #worker;
  #runtime;
  #history = [];
  id;
  scope;

  constructor(scope = 'global') {
    this.scope = scope === 'local' ? scope : 'global';
    this.workerScript = URL.createObjectURL(
      new Blob([workerTemplate], {
        type: 'text/javascript'
      })
    );

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

  init(packages = []) {
    // initialize web worker for proper Python runtime scope/context
    this.packages = packages;
    this.#assignWorker();
    return this.#newRuntime();
  }

  run(code) {
    return new Result().run(this.#runtime, this.#history, code);
  }

  restart() {
    console.log('Restarting Python session...');
    this.#history.push('RESTART SESSION\n');
    this.#worker.terminate();

    const promise = new Promise((resolve, reject) => {
      this.#assignWorker(true);
      this.#newRuntime()
        .then(res => resolve(res))
        .catch(err => reject(err));
    });

    return promise;
  }

  // eslint-disable-next-line no-undef
  #assignWorker(force = false) {
    if (this.scope === 'local') {
      this.#worker = new Worker(this.workerScript);
    } else {
      // check is class wide shared worker is defined yet
      if (force) {
        Repl.#WORKER = new Worker(this.workerScript);
      } else {
        Repl.#WORKER = Repl.#WORKER || new Worker(this.workerScript);
      }

      this.#worker = Repl.#WORKER;
    }
  }

  // eslint-disable-next-line no-undef
  #newRuntime() {
    this.#runtime = new Runtime(this.#worker, this.id);

    const promise = new Promise((resolve, reject) => {
      // initialize Pyodide and preload packages
      this.#runtime
        .init(this.packages)
        .then(res => {
          if (res === this.#runtime) {
            resolve(this);
          }
        })
        .catch(res => {
          reject(res);
        });
    });

    return promise;
  }
}
