/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff', // White
        surface: '#f4f4f5', // Very light gray (zinc-100)
        surfaceHighlight: '#e4e4e7', // zinc-200
        borderSubtle: '#d4d4d8', // zinc-300
        textPrimary: '#09090b', // Dark gray/black
        textSecondary: '#52525b', // Medium gray
        allow: '#10b981',
        ask: '#f59e0b',
        block: '#ef4444',
        white: '#000000', // Invert white utilities to black
        black: '#ffffff', // Invert black utilities to white
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
