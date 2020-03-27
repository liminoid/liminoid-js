import Runtime from './Runtime'; // eslint-disable-line no-unused-vars
import workerTemplate from './worker';

export default class Repl {
  // class fields
  static count = 0;
  static #workerScript = URL.createObjectURL(
    new Blob([workerTemplate], {
      type: 'text/javascript'
    })
  );

  // private instance fields
  #worker;
  #runtime;
  #history = [];
  #value;
  #id;
  #packages;

  constructor() {
    // update class state shared between editors
    Repl.count += 1;
    this.#id = Repl.count;
  }

  // public instance API
  get id() {
    return this.#id;
  }

  get packages() {
    return this.#packages;
  }

  get history() {
    return this.#history.map(x => x.cmd).join('\n');
  }

  get callCount() {
    return this.#history.length;
  }

  get worker() {
    return this.#worker;
  }

  get value() {
    return this.#value;
  }

  async init(packages = [], worker = new Worker(Repl.#workerScript)) {
    // initialize web worker for proper Python runtime scope/context
    this.#worker = worker;
    this.#packages = packages;
    this.#runtime = await new Runtime(this.#worker, this.#id).init(
      this.#packages
    );

    // return `Repl()` to allow `run()` chaining
    return this;
  }

  async restart(
    packages = this.#packages,
    worker = new Worker(Repl.#workerScript)
  ) {
    const startTs = Date.now();

    this.#worker.terminate();
    await this.init(packages, worker);

    const log = { start: startTs, end: Date.now(), cmd: '$RESTART SESSION$' };
    this.#history.push(log);

    return this;
  }

  async run(code) {
    const startTs = Date.now();
    this.#value = await this.#runtime.exec(code);

    const log = { start: startTs, end: Date.now(), cmd: code };
    this.#history.push(log);

    return this;
  }
}
