// webpack.config.js
const Dotenv = require('dotenv-webpack');
const path = require('path');

// Detecta el entorno de ejecución y selecciona el archivo .env correspondiente
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';

module.exports = {
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, envFile), // Usa el archivo .env adecuado según el entorno
      safe: true, // Asegura que todas las variables estén definidas
    }),
  ],
};
