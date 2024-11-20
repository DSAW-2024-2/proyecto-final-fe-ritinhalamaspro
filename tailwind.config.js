// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        details: '#898A8D',
        third: '#1E3A8A', // Ejemplo de color personalizado
        // Agrega otros colores según tus necesidades
      },
      fontFamily: {
        'sans': ['"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
