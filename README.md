<div align="center">

  <h1>🔵🔴`liminoid-js` 🔴🔵</h1>

<strong>Lightweight embeddable client-side Python REPLs 🙌 Made possible through the magic of [Web Assembly](https://webassembly.org/) and standing on the shoulders of [PyIodide](https://github.com/iodide-project/pyodide)</strong>

</div>

<div align="center">
  <h3>
    <a href="#">
      Docs
    </a>
    <span> | </span>
    <a href="#">
      Examples
    </a>
    <span> | </span>
    <a href="#">
      Chat
    </a>
  </h3>
</div>

### Features:

- **🔐safe:** all the code runs in a sandboxed Web Assembly environment.
- **🕵️private:** no data or code sent to any servers.
- **🏎fast:** near-native speed with no network communication needed (and automatic GPU offloading through WebGL).
- **🏗scalable:** execution happens on the client so it doesn't matter how many people you share it with!
- **📵works offline:** it. just does. well as long as your web browser is on your local machine...
- **🪁lightweight:** library itself is **~3kb** and lazy-loads [PyIodide](https://github.com/iodide-project/pyodide) Web Assembly modules in the background.
- **👯multiplicitous:** can run multiple concurrent Python interpreters asynchronously each in a their own web worker context.

## Quickest start (ES6 modules)

`yarn add liminoid-js`

Since `liminoid-js` internally depends on [Pyodide]() to run Python code using Web Assembly in a Web Worker, this package (currently) only workers in a browser environment. Node.js support through [Wasmtime](https://wasmtime.dev/) is on the roadmap however and shouldn't be too difficult to adapt the current code to run as such.

```html
<script type="module">
  import { Repl } from 'https://unpkg.com/liminoid-js';

  // initialize the Python runtime
  const repl = await new Repl({}).init();

  // import libraries needed
  await repl.run('import pandas as pd');

  // Repl context persists across calls to `run()`
  const result = await repl.run(
    'pd.read_csv("https://covidtracking.com/api/states.csv").sort_values("total")'
  );

  console.log(result); //=>
</script>
```

## Quick start (UMD script)

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- load library -->
    <script src="https://unpkg.com/exeggutor/..." crossorigin></script>
  </head>
  <body>
    <script>
      const snippet = `print(🥚🌴🥚 exegguting 🥚🌴🥚)`;

      ReactDOM.render(
        React.createElement(Exeggutor, { code: snippet }, null), // pass an empty `prop` object to use all defaults
        document.getElementById('root')
      );
    </script>
  </body>
</html>
```

## Goals

- Power explainers that use simulations or other data analyses that are awkward to accomplish in Javacript (or that you don't want to do in JS).
- Make web based interactive documents accessible to the scientific python/data science community.
- Enable expensive computational operations that would otherwise be infeasible in interactive experiences.

## Roadmap

- [ ] Node.js support through [Wasmtime](https://wasmtime.dev/)

## Contributing/Requests

Open an issue for feature requests or message inquiries[at]jonathan.industries

## License

All original work licensed under either of

- [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)
- [MIT license](http://opensource.org/licenses/MIT)

at your option.

> Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
