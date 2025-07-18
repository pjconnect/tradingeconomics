/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind v4 automatically detects content.
  // However, explicitly listing it can help with some build systems or editor tooling.
  // Make sure this array correctly points to all files containing Tailwind classes.
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // Keep darkMode as 'class' since we're manually toggling themes via data-theme attribute
  darkMode: 'class', 
  theme: {
    extend: {
      // In v4, you generally don't define your custom colors here anymore.
      // They are handled by the @theme directive in your CSS.
      // This section is mostly for extending default Tailwind values or adding custom stuff
      // that isn't directly tied to CSS variables for theming.
    },
  },
  plugins: [],
};