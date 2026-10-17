import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        marketplace: resolve(__dirname, 'marketplace/index.html'),
        modelo3d: resolve(__dirname, 'modelo-3d/index.html')
      }
    }
  }
});
