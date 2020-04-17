import { expect } from 'chai';

import Repl from '../src/Repl';

// Test case needs to run in the browser to properly use web workers
export default function () {
  it('sets a unique id', function () {
    const repl = new Repl();
    const repl2 = new Repl();
    const repl3 = new Repl('UnIqueLo');

    expect(repl.id).to.not.equal(repl2.id);
    expect(repl3.id).to.equal('UnIqueLo');
  });

  it('initializes a Runtime()', async function () {
    try {
      const repl = await new Repl().init();
      expect(repl).to.be.an.instanceof(Repl);
    } catch {
      expect.fail();
    }
  });

  it('should deduplicate packages on subsequent load() calls', async function () {
    let repl = await new Repl().init();
    expect(repl.packages).to.be.an('set').that.is.empty;

    repl = await repl.load(['numpy']);
    expect(repl).to.be.an.instanceof(Repl);
    expect(repl.packages).to.have.lengthOf(1);
    expect(repl.packages).to.include('numpy');

    repl = await repl.load(['numpy', 'networkx']);
    expect(repl).to.be.an.instanceof(Repl);
    expect(repl.packages).to.have.lengthOf(2);
    expect(repl.packages).to.include('numpy');
    expect(repl.packages).to.include('networkx');
  });

  it('returns a promise that resolves to the Repl with a value attached', async function () {
    const repl = await new Repl().init();

    const promise = repl.run('1 + 2');
    expect(promise).to.be.an.instanceof(Promise);

    const result = await promise;
    expect(result).to.equal(repl);
    expect(result.value).to.equal(3);
  });

  it('keeps a history of the code run', async function () {
    const repl1 = await new Repl().init();
    const repl2 = await new Repl().init();

    await repl1.run('1 + 2');
    expect(repl1.history).to.equal('1 + 2');

    await repl2.run('print("hello")');
    expect(repl2.history).to.equal('print("hello")');

    await repl1.run('print("chai")');
    expect(repl1.history).to.equal('1 + 2\nprint("chai")');
    expect(repl2.history).to.equal('print("hello")');
  });

  it('can restart the Python session', async function () {
    const repl = await new Repl().init();

    await repl.run('birds = "awesome"');
    const result = await repl.run('birds');
    const oldValue = result.value;
    expect(oldValue).to.equal('awesome');
    const oldWorker = repl.worker;

    await repl.restart();

    const newResult = await repl.run('"birds" in globals()');

    expect(oldValue).to.equal('awesome');
    expect(newResult.value).to.equal(false);
    expect(repl.worker).to.not.equal(oldWorker);
  });

  it('counts the number of code executions', async function () {
    const repl1 = await new Repl().init();
    const repl2 = await new Repl().init();

    expect(repl1.callCount).to.equal(0);
    expect(repl2.callCount).to.equal(0);

    await repl1.run('1 + 2');
    expect(repl1.callCount).to.equal(1);
    await repl2.run('1 + 2');
    expect(repl2.callCount).to.equal(1);

    await repl1.restart();
    expect(repl1.callCount).to.equal(2);
  });
}
