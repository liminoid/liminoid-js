////////////////////////////////////////////////////////////////////
// Test case needs to run in the browser to properly use web workers
////////////////////////////////////////////////////////////////////

import { expect } from 'chai';

import Repl from '../src/Repl.js';

export default function() {
  it('increments the total number of instances on initialization', function() {
    expect(Repl.count).to.equal(0);
    new Repl();
    expect(Repl.count).to.equal(1);
    new Repl();
    expect(Repl.count).to.equal(2);
  });

  it('sets unique incrementing ids', function() {
    const repl = new Repl();
    // since class variables are shared for the tests we expect this to be 3
    expect(repl.id).to.equal(3);
  });

  it('defaults to "global" context', function() {
    const repl = new Repl();
    expect(repl.scope).to.equal('global');

    // if an unknown scope is passed it defaults to global
    const repl2 = new Repl({ scope: 'unknown' });
    expect(repl2.scope).to.equal('global');
  });

  it('shares a web worker for a "global" context', async function() {
    const repl = await new Repl({
      workerScript: '../dist/worker.js'
    }).init();
    const repl2 = await new Repl({
      workerScript: '../dist/worker.js'
    }).init();

    expect(repl.worker).to.equal(repl2.worker);
  });

  it('creates a new web worker for "local" context', async function() {
    const repl = await new Repl({
      workerScript: '../dist/worker.js'
    }).init();
    const repl2 = await new Repl({
      workerScript: '../dist/worker.js',
      scope: 'local'
    }).init();

    expect(repl.scope).to.equal('global');
    expect(repl2.scope).to.equal('local');
    expect(repl.worker).to.not.equal(repl2.worker);
  });

  it('initializes a Runtime() and preloads packages', async function() {
    try {
      const repl = await new Repl({
        workerScript: '../dist/worker.js',
        packages: ['numpy']
      }).init();
    } catch {
      expect.fail();
    }
  });

  it('returns a promise with results of run code', async function() {
    const repl = await new Repl({
      workerScript: '../dist/worker.js'
    }).init();

    const promise = repl.run('1 + 2');
    expect(promise).to.be.an.instanceof(Promise);

    const result = await promise;
    expect(result).to.equal(3);
  });

  it('keeps a history of the code run', async function() {
    const repl = await new Repl({
      workerScript: '../dist/worker.js'
    }).init();

    await repl.run('1 + 2');
    expect(repl.history).to.equal('1 + 2');

    await repl.run('print("chai")');
    expect(repl.history).to.equal('1 + 2\nprint("chai")');
  });

  it('counts the number of code executions', async function() {
    const repl = await new Repl({
      workerScript: '../dist/worker.js'
    }).init();

    expect(repl.runCount).to.equal(0);

    await repl.run('1 + 2');
    expect(repl.runCount).to.equal(1);

    await repl.run('print("chai")');
    expect(repl.runCount).to.equal(2);
  });

  it('can restart the Python session', async function() {
    const repl = await new Repl({
      workerScript: '../dist/worker.js'
    }).init();

    await repl.run('birds = "awesome"');
    const result = await repl.run('birds');
    expect(result).to.equal('awesome');
    const oldWorker = repl.worker;

    // do not ask for confirmation dialog
    await repl.restart(false);
    const newResult = await repl.run('"birds" in globals()');

    expect(newResult).to.equal(false);
    expect(repl.worker).to.not.equal(oldWorker);
  });
}
