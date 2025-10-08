/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Iconos y Botones
        button: {
          primary: '#2C5282',
          secondary: '#4A5568',
        },
        
        // Textos
        text: {
          title: '#2C5282',
          primary: '#1A202C',
          secondary: '#4A5568',
          muted: '#718096',
          light: '#F7FAFC',
          white: '#FFFFFF',
          'light-hover': '#E2E8F0',
        },
        
        // Fondos
        background: {
          primary: '#FFFFFF',
          secondary: '#F8F9FA',
          dark: '#2D3748',
          darker: '#1A202C',
        },
        
        // Estados de dispositivos IoT
        device: {
          available: '#22C55E',
          maintenance: '#EAB308',
          occupied: '#E31919',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}