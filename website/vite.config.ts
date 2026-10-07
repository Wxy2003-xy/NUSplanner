import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/NUSplanner/',
  root: path.resolve(__dirname),
});


