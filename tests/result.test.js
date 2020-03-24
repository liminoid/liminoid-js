import { expect } from 'chai';

import Result from '../src/Result.js';
import Runtime from '../src/Runtime.js';
import workerTemplate from '../src/worker';

export default function() {
  it('defaults to an uninitialized value', function() {
    const result = new Result();
    expect(result.value).to.be.undefined;
  });

  it('initializes a value when passed in the constructor', function() {
    const result = new Result(1);
    expect(result.value).to.be.equal(1);
  });

  it('can only initialize a value in the constructor', function() {
    const result = new Result(1);

    const setVal = () => {
      result.value = 2;
    };

    expect(setVal).to.throw();
  });

  it('returns a promise that resolves to the value', async function() {
    const workerUrl = URL.createObjectURL(
      new Blob([workerTemplate], {
        type: 'text/javascript'
      })
    );

    const runtime = new Runtime(new Worker(workerUrl), 1);
    let history = [];
    const promise = new Result().run(await runtime.init(), history, '1 + 2');
    expect(promise).to.be.an.instanceof(Promise);
    expect(history).to.have.ordered.members(['1 + 2']);
    const result = await promise;
    expect(result).to.be.an.instanceof(Result);
    expect(result.value).to.equal(3);
  });
}
