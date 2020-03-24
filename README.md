<div align="center">

  <h1>🔵🔴 liminoid-js 🔴🔵</h1>

<strong>Asynchonous Javascript REPL for web assembly language runtimes</strong>

</div>

<div align="center">
  <h3>
    <a href="https://liminoid.io/guides/javascript/">
      Documentation
    </a>
    <span> | </span>
    <a href="https://matrix.to/#/!CPoHZRWLrkbgPuzGpU:matrix.org/$cw1qJZO_Ykr4rPF5_Of3OXGg_4j8E4LkqdkFqGFGA_U?via=matrix.org">
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
  </h3>
</div>

## Installation

`$ yarn add liminoid-js` or `$ npm install --save liminoid-js`

## Usage

For a more comprehensive guide to using the package see the [documentation](https://liminoid.io/guides/javascript/).

```js
const repl = new Repl();

// each call to run() returns a promise that
// resolves to a Result of the expression
repl
  .init(['numpy'])
  .run('import numpy as np')
  .run('array = np.array([1,2,3])')
  .run('array.max()')
  .then(res => console.log(res.value));

const code = `
import numpy as np
array = np,array([1,2,3])
array.max()
`.trim();

repl.init(['numpy']).run(code);
```

## Contributing/Requests

Open an issue or post a message in the [chatroom](https://matrix.to/#/!CPoHZRWLrkbgPuzGpU:matrix.org/$cw1qJZO_Ykr4rPF5_Of3OXGg_4j8E4LkqdkFqGFGA_U?via=matrix.org).

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
