import { builtinModules } from 'module';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svelte from 'rollup-plugin-svelte';
import { string } from 'rollup-plugin-string';
import json from '@rollup/plugin-json';
import { dependencies, peerDependencies } from './package.json';

const extensions = ['.js', '.ts'];
const dev = process.env.NODE_ENV !== 'production';

export default {
  input: ['./src/index.ts'],
  external: id =>
    [...builtinModules, ...Object.keys(dependencies), ...Object.keys(peerDependencies)].find(pkg =>
      id.startsWith(pkg)
    ),
  plugins: [
    resolve({ extensions }),
    string({ include: '**/*.css' }),
    typescript(),
    svelte({ generate: 'ssr', dev }),
    json(),
  ],
  output: {
    format: 'cjs',
    dir: './out',
  },
};
