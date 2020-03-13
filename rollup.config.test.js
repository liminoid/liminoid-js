import commonjs from '@rollup/plugin-commonjs';
import plugins from './rollup.plugins.js';

export default {
  input: 'tests/runner.js',
  output: [
    {
      file: 'tests/bundle.js',
      format: 'iife'
    }
  ],
  plugins: plugins.concat(
    commonjs({
      namedExports: {
        chai: ['expect']
      }
    })
  )
};
