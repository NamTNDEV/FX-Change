/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#cceff1',
          200: '#99dfe3',
          300: '#66cfd5',
          400: '#33bfc7',
          500: '#00afb9',
          600: '#008c94',
          700: '#00696f',
          800: '#00464a',
          900: '#002325',
        },
      },
      gridTemplateColumns: {
        stuff_detail: '1fr 400px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
