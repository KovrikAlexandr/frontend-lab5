import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('./', import.meta.url));

export default defineConfig({
  root,
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        catalog: fileURLToPath(new URL('./catalog.html', import.meta.url)),
        product: fileURLToPath(new URL('./product.html', import.meta.url)),
        cart: fileURLToPath(new URL('./cart.html', import.meta.url)),
        checkout: fileURLToPath(new URL('./checkout.html', import.meta.url)),
        about: fileURLToPath(new URL('./about.html', import.meta.url)),
      },
    },
  },
});
