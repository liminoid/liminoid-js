import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

import { terser } from 'rollup-plugin-terser';

import * as meta from './package.json';

const outputCommon = {
  name: 'liminoid-lib',
  banner: `// ${meta.homepage} v${
    meta.version
  } Copyright ${new Date().getFullYear()} ${meta.author.name}`
};

const plugins = [babel()];

////////////////////
// main library files
////////////////////
const umd = {
  input: 'src/index.js',
  plugins: plugins,
  output: [
    {
      ...outputCommon,
      file: 'dist/liminoid-lib.umd.min.js',
      format: 'umd',
      plugins: [
        terser({
          output: {
            preamble: outputCommon.banner
          }
        })
      ]
    }
  ]
};

const module = {
  input: 'src/index.js',
  plugins: plugins,
  output: [
    {
      ...outputCommon,
      file: 'dist/liminoid-lib.esm.min.js',
      format: 'esm',
      plugins: [
        terser({
          output: {
            preamble: outputCommon.banner
          }
        })
      ]
    }
  ]
};

/////////////////////////////////////////////
// Web worker script to interface with Pyodide
/////////////////////////////////////////////
// const worker = {
//   input: 'src/worker.js',
//   treeshake: false,
//   plugins: [
//     ...plugins,
//     copy({
//       targets: [{ src: 'external/pyodide', dest: 'tests/' }],
//       copyOnce: true
//     })
//   ],
//   output: [
//     // unminified for testing
//     {
//       ...outputCommon,
//       file: 'tests/worker.js',
//       format: 'umd'
//     },
//     // minified for distribution
//     {
//       ...outputCommon,
//       file: 'dist/worker.js',
//       format: 'umd',
//       plugins: [
//         terser({
//           output: {
//             preamble: outputCommon.banner
//           }
//         })
//       ]
//     }
//   ]
// };

//////////////////////////////////////
// test runner for Mocha browser tests
//////////////////////////////////////
const tests = {
  input: 'tests/runner.js',
  output: [
    {
      file: 'tests/bundle.js',
      format: 'iife'
    }
  ],
  plugins: [
    ...plugins,
    resolve(),
    commonjs({
      namedExports: {
        chai: ['expect']
      }
    })
  ]
};

export default [umd, module, tests];
