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
            { src: 'manifest.json', dest: '.' },
            { src: 'styles.css', dest: '.', rename: 'styles.css' }
          ],
          hook: 'writeBundle'
        })
      ]
    }
  }
});