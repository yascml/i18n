import { defineConfig } from 'vite';

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
}));
