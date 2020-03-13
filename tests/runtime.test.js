////////////////////////////////////////////////////////////////////
// Test case needs to run in the browser to properly use web workers
////////////////////////////////////////////////////////////////////

import { expect } from 'chai';

import Runtime from '../src/Runtime.js';

export default function() {
  let runtime;

  before(async function() {
    runtime = await new Runtime(new Worker('../dist/worker.js'), 1).init([
      'numpy'
    ]);
  });

  it('should initialize Pyodide and preload packages', function() {
    expect(runtime.packages).to.include('numpy');
  });

  it('should return correct results when running Python code', async function() {
    const result = await runtime.exec('1 + 2');
    expect(result).to.equal(3);
  });

  it('should run multiple runtime contexts simultaneously', async function() {
    await runtime.exec('color = "orange"');
    const color1 = await runtime.exec('color');

    const runtime2 = await new Runtime(
      new Worker('../dist/worker.js'),
      null,
      2
    ).init();

    const color2 = await runtime2.exec('color = "purple"; color');

    expect(color1).to.equal('orange');
    expect(color2).to.equal('purple');
  });
}
