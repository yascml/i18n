import { resolve } from 'path';
import { defineConfig } from 'vite';
import cp from 'vite-plugin-cp';
import zipPack from 'vite-plugin-zip-pack';
import { version } from './package.json';

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    target: 'es6',
    lib: {
      entry: './lib/main.ts',
      name: 'YASCI18n',
      fileName: (format) => `i18n${format !== 'umd' ? `.${format}` : ''}.js`,
      formats: [ 'umd' ]
    },
  },
  plugins: [
    cp({
      targets: [
        {
          src: resolve(__dirname, './meta.json'), dest: resolve(__dirname, './dist'), 
          transform(buf) {
            const meta = JSON.parse(buf.toString());
            return JSON.stringify({
              ...meta,
              version,
            });
          }
        }
      ],
    }),
    zipPack({
      inDir: resolve(__dirname, './dist'),
      outDir: resolve(__dirname, './dist'),
      outFileName: 'i18n.zip',
    }),
  ],
}));
