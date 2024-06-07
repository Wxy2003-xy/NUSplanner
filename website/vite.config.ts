import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Ensure this is set to 'dist'
  },
  base: '/NUSplanner/'  // Make sure base path is correct
});
