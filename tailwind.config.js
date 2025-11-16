/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyber Pastel Palette
        'baby-blue': '#A8D8EA',
        'lavender': '#C5B9E8',
        'pastel-cyan': '#B4E4FF',
        'off-white': '#F8F9FA',
        'charcoal': '#3A3A3C',
        'soft-neon': '#D4A5FF',
        'glow-pink': '#FFB3E6',
        'holo-blue': '#8EC5FC',
        'mint-soft': '#CBFFD3',
        
        // Legacy (for compatibility)
        'deep-dark': '#2A2A2C',
        'card-dark': '#1F1F21',
        'hover-gray': '#282828',
        'accent-orange': '#FF6B35',
        'success-green': '#1ED760',
        'warning-amber': '#FFA726',
        'spotify-green': '#1DB954',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B3B3B3',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        'cyber': ['DM Sans', 'Plus Jakarta Sans', 'ui-rounded', 'system-ui', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'roboto-condensed': ['Roboto Condensed', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        // Cyber Pastel Glows
        'cyber-glow': '0 0 30px rgba(168, 216, 234, 0.4), 0 0 60px rgba(197, 185, 232, 0.2)',
        'lavender-glow': '0 0 25px rgba(197, 185, 232, 0.5)',
        'neon-soft': '0 0 20px rgba(212, 165, 255, 0.4)',
        'float': '0 8px 32px rgba(168, 216, 234, 0.2), 0 4px 16px rgba(197, 185, 232, 0.15)',
        'float-hover': '0 12px 48px rgba(168, 216, 234, 0.3), 0 8px 24px rgba(197, 185, 232, 0.25)',
        'holo': '0 0 40px rgba(142, 197, 252, 0.3), inset 0 0 20px rgba(255, 179, 230, 0.1)',
        
        // Legacy
        'spotify-glow': '0 0 20px rgb(29, 185, 84, 0.3)',
        'accent-glow': '0 0 24px rgb(255, 107, 53, 0.25)',
        'card-elevated': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.15)',
      },
      screens: {
        'xs': '380px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'holo-shift': 'holo-shift 8s linear infinite',
        'tilt': 'tilt 0.3s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(168, 216, 234, 0.3), 0 0 40px rgba(197, 185, 232, 0.2)',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(168, 216, 234, 0.5), 0 0 60px rgba(197, 185, 232, 0.4)',
            filter: 'brightness(1.1)'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'holo-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'tilt': {
          '0%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'perspective(1000px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))' },
        },
      },
      backgroundImage: {
        'iridescent': 'linear-gradient(135deg, #A8D8EA 0%, #C5B9E8 25%, #B4E4FF 50%, #D4A5FF 75%, #FFB3E6 100%)',
        'holo': 'linear-gradient(135deg, rgba(168, 216, 234, 0.3) 0%, rgba(197, 185, 232, 0.3) 50%, rgba(212, 165, 255, 0.3) 100%)',
        'cyber-blur': 'radial-gradient(circle at 50% 0%, rgba(168, 216, 234, 0.2), transparent 70%)',
      },
    },
  },
  plugins: [],
}
