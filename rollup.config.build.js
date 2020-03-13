import commonjs from '@rollup/plugin-commonjs';
import plugins from './rollup.plugins.js';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'esm'
    },
    plugins: plugins.concat(commonjs())
};
