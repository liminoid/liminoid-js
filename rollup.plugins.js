import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';

const plugins = [
    babel(),
    resolve(),
    json(),
    postcss({
        plugins: []
    }),
    sucrase({
        exclude: ['node_modules/**'],
        transforms: ['jsx']
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify('production')
    })
];

export default plugins;
