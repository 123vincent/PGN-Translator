import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
      fileName: () => 'main.js'
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['obsidian'],
      plugins: [
        copy({
          targets: [
            { src: 'manifest.json', dest: 'dist' },
            { src: 'styles.css', dest: 'dist' } // uniquement si styles.css existe
          ],
          hook: 'writeBundle'
        })
      ]
    }
  }
});
