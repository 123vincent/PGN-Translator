import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
      fileName: () => 'main.js'
    },
    rollupOptions: {
      external: ['obsidian'],
      plugins: [
        copy({
          targets: [
            { src: 'manifest.json', dist: '.' },
            { src: 'styles.css', dist: '.', rename: 'styles.css' }
          ],
          hook: 'writeBundle'
        })
      ]
    }
  }
});
