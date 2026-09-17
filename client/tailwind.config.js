/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b', // Near black
        surface: '#18181b', // Graphite
        surfaceHighlight: '#27272a',
        borderSubtle: '#3f3f46',
        textPrimary: '#f4f4f5',
        textSecondary: '#a1a1aa',
        allow: '#10b981', // Emerald
        ask: '#f59e0b', // Amber
        block: '#ef4444', // Crimson
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
