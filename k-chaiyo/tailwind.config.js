/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          primary: '#7C3AED',
          secondary: '#2563EB',
          accent: '#06B6D4',
          ink: '#1F2937',
          muted: '#6B7280'
        },
        shop: {
          green: '#0C831F',
          greenDark: '#0A6E1A',
          greenLight: '#E8F5EA',
          yellow: '#F7CB45',
          line: '#E9E9EB',
          bg: '#FAFAFA',
          text: '#1F2937',
          mutedText: '#828282',
          discount: '#256FEF'
        }
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        cardHover: '0 12px 28px rgba(0,0,0,0.10)',
        soft: '0 1px 3px rgba(0,0,0,0.06)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        },
        'pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.35s ease-out both',
        shimmer: 'shimmer 1.4s linear infinite',
        pop: 'pop 0.25s ease-out'
      }
    }
  },
  plugins: []
};
