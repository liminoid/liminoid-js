import { expect } from 'chai';

import Runtime from '../src/Runtime';
import workerTemplate from '../src/worker';

// Test case needs to run in the browser to properly use web workers
export default function() {
  let runtime;

  before(async function() {
    const workerUrl = URL.createObjectURL(
      new Blob([workerTemplate], {
        type: 'text/javascript'
      })
    );
    runtime = new Runtime(new Worker(workerUrl), 1);
    await runtime.init();
  });

  it('should preload packages', async function() {
    try {
      await runtime.load(['numpy']);
    } catch {
      expect.fail();
    }
  });

  it('should support multiple load calls', async function() {
    try {
      await runtime.load(['numpy']);
      await runtime.load(['networkx']);
    } catch {
      expect.fail();
    }
  });

  it('should return correct results when running Python code', async function() {
    const result = await runtime.exec('1 + 2');
    expect(result).to.equal(3);
  });

  it('should run multiple runtime contexts simultaneously', async function() {
    await runtime.exec('color = "orange"');

    const runtime2 = await new Runtime(
      new Worker(
        URL.createObjectURL(
          new Blob([workerTemplate], {
            type: 'text/javascript'
          })
        )
      ),
      2
    ).init();
    await runtime2.exec('color = "purple"');
    const color1 = await runtime.exec('color');
    await runtime.exec('color = "blue"');
    const color2 = await runtime2.exec('color');

    expect(color1).to.equal('orange');
    expect(color2).to.equal('purple');
  });
}
