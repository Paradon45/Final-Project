module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(25px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0'},
          '100%': { opacity: '1'},
        },
        fadeOut: {
          '0%': { opacity: '1'},
          '100%': { opacity: '0'},
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
      },
      animation: {
        fadeIn: 'fadeInDown 0.6s ease-in-out forwards',
        fadeInDelay1: 'fadeInDown 0.8s ease-in-out',
        fadeInDelay2: 'fadeInDown 1s ease-in-out',
        fadeInDelay3: 'fadeInDown 2s ease-in-out',
        fadeInDelay4: 'fadeInDown 2.25s ease-in-out',
        fadeIn2: 'fadeIn 0.3s ease-in-out',
        fadeIn2Delay1: 'fadeIn 0.6s ease-in-out',
        fadeIn2Delay2: 'fadeIn 1s ease-in-out',
        fadeIn3: 'fadeInLeft 0.6s ease-in-out',
        fadeIn3Delay1: 'fadeInLeft 0.8s ease-in-out forwards',
        fadeOut: 'fadeOut 0.3s ease-in-out',
        'spin-slow': 'spin 60s linear infinite',
        scaleUp: 'scaleUp 0.3s ease-in-out',
        shake: "shake 0.5s ease-in-out",
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
