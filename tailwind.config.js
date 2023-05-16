/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        columbia: {
          100: '#D2E5F5',
          200: '#C7DFF2',
          300: '#BFDAF0',
          400: '#B4D4EE',
        },
        cool: {
          100: '#C2BED1',
          200: '#B3AEC5',
          300: '#A8A3BD',
          400: '#9993B2',
        },
        erie: {
          100: '#717071',
          200: '#4D4D4E',
          300: '#353436',
          400: '#222725',
        },
        error: '#DD5858',
        info: '#4C91F9',
        mountbatten: {
          100: '#B3AAAF',
          200: '#A1959B',
          300: '#94868E',
          400: '#81717A',
        },
        night: {
          100: '#717071',
          200: '#4D4D4E',
          300: '#353436',
          400: '#121113',
        },
        periwinkle: {
          100: '#CACDEB',
          200: '#BDC0E6',
          300: '#B4B7E2',
          400: '#A7ABDD',
        },
        powder: '#F7F7F2',
        rose: {
          100: '#C4BAC7',
          200: '#B6A9B9',
          300: '#AB9DAF',
          400: '#9D8CA1',
        },
        success: '#18B286',
        warning: '#F9A826'
      }
    },
  },
  plugins: [],
}
