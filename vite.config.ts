import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Prioritize VITE_GEMINI_API_KEY, then API_KEY, then fallback to process.env
  const apiKey = env.VITE_GEMINI_API_KEY || env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // This ensures that process.env.API_KEY is replaced by the actual value during build
      // preventing "process is not defined" errors in the browser.
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
