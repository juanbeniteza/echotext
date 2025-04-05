/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]', '.dark-mode'], // Support multiple dark mode selectors
  theme: {
    extend: {
      backgroundColor: {
        dark: 'var(--background)',
      },
      textColor: {
        dark: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}; 