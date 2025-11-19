/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#000000',
          surface: '#0a0a0a',
          card: '#111111',
        },
        accent: {
          primary: '#4A90E2', // Calm blue
          secondary: '#7B8A8B', // Soft gray-blue
          tertiary: '#95A5A6', // Light gray
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(74, 144, 226, 0.5), 0 0 10px rgba(74, 144, 226, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(74, 144, 226, 0.3), 0 0 30px rgba(74, 144, 226, 0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}

