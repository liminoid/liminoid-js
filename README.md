<div align="center">

  <h1>🔵🔴 liminoid-js 🔴🔵</h1>

<strong>Lightweight asynchonous Javascript REPL for web assembly language runtimes</strong>

</div>

<div align="center">
  <h4>
    <a href="https://liminoid.io/reference/javascript/">
      Documentation
    </a>
    <span> | </span>
    <a href="https://discord.gg/e2vxBhu">
      Chatroom
    </a>
    <span> | </span>
    <a href="https://twitter.com/liminoid_io">
      Twitter
    </a>
    <span> | </span>
    <a href="https://stackoverflow.com/questions/tagged/liminoid">
      Stack Overflow
    </a>
    <span> | </span>
    <a href="https://liminoid.io/contributing/">
      Contributing
    </a>
  </h4>
</div>

## Installation

```sh
$ yarn add liminoid-js
```

or

```sh
$ npm install --save liminoid-js
```

## Usage

For a more comprehensive guide to using the package see the [documentation](https://liminoid.io/reference/javascript/) or browse the [examples](examples).

```js
// easiest to use ES6 imports from the UNPKG CDN
import { Repl } from 'https://unpkg.com/liminoid-js';

// Repl() constuctor is synchronous
const repl = new Repl();

// each call to run() returns a promise that resolves
// to the Repl() object. The value of the executed
// expression is stored as `.value` on the Repl()
repl
  .init()
  .then(repl => repl.load(['numpy']))
  .then(repl => repl.run('import numpy as np'))
  .then(repl => repl.run('a = [[1, 0], [0, 1]]'))
  .then(repl => repl.run('b = [[4, 1], [2, 2]]'))
  .then(repl => repl.run('np.dot(a, b)'))
  .then(repl => console.log(repl.value)); //=> Array[ Int32Array [ 4, 1 ], Int32Array [ 2, 2 ] ]
```

If you want to run a chunk of code in a single call you can use Javascript template literals.

```js
// NOTE: importing a library twice (numpy here) can cause an error
// so we leave the import out of the code chunk.
const code = `
a = [[1, 0], [0, 1]]
b = [[4, 1], [2, 2]]
np.dot(a, b)
`.trim();

// you can use await syntax as long as you are in an async function
const dotProduct = (async () => {
  const repl = await new Repl().init();
  await repl.load(['numpy']);
  await repl.run('import numpy as np');

  const result = await repl.run(code);
  console.log(result.value); //=> Array[ Int32Array [ 4, 1 ], Int32Array [ 2, 2 ] ]
})();
```

See how to run this example in a web page: [examples/hello-liminoid.html](examples/hello-liminoid.html)

## Contributing/Requests

Open an [issue](https://github.com/liminoid/liminoid-js/issues) or post a message in the [chatroom](https://discord.gg/e2vxBhu). If you would like to contribute to the project (code, documentation, tutorials, etc.) see the [contributing guide](https://liminoid.io/contributing/) for how to get started 🙌

## Citing

While not required, when using (or extending) Liminoid for academic work, citations are appreciated 🙏

```
@software{liminoid,
  author = {Jonathan Dinu},
  title = {Liminoid: Web assembly toolkit for building local-first analytics applications},
  url = {https://github.com/liminoid},
  version = {0.0.1},
  month = {March},
  year = {2020}
}
```

## License

All original work licensed under either of:

- [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)
- [MIT license](http://opensource.org/licenses/MIT)

at your option.

> Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
