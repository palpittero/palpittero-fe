import daisyui from 'daisyui'

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // importa todos os arquivos do projeto
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}
