/**** Tailwind config ****/
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      colors: {
        border: 'hsl(214 32% 91%)',
        input: 'hsl(214 32% 91%)',
        ring: 'hsl(215 20% 65%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 67% 0%)',
        primary: { DEFAULT: '#111827', foreground: '#FFFFFF' },
        secondary: { DEFAULT: '#F3F4F6', foreground: '#111827' },
        destructive: { DEFAULT: '#EF4444', foreground: '#FFFFFF' }
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)'
      },
    },
  },
  plugins: [],
};
