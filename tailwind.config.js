/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // IMPORTANT
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#e6f0ff',
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af',
        },
        surface: '#ffffff',
        background: '#f9fafb', // gray-50
        text: {
          light: '#6b7280', // gray-500
          DEFAULT: '#374151', // gray-700
          dark: '#111827',    // gray-900
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 14px rgba(0, 0, 0, 0.05)',
        hover: '0 8px 20px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        card: '1rem',
        button: '9999px',
      },
    },
  },
  plugins: [],
};
