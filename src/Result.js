export default class Result {
  #value;

  constructor(value) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  run(runtime, history, code) {
    history.push(code);

    return new Promise((resolve, reject) => {
      runtime
        .exec(code)
        .then(res => resolve(new Result(res)))
        .catch(err => reject(err));
    });
  }
}
