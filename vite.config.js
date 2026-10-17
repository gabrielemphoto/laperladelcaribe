import { resolve } from 'path';
import { cpSync, existsSync } from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'copy-static-assets',
      closeBundle() {
        if (existsSync('assets/images')) {
          cpSync('assets/images', 'dist/assets/images', { recursive: true });
        }
      }
    }
  ],
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
