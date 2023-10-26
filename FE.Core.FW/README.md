các bước chạy project
* npm i -g pnpm
* pnpm install
* npm i moment
* pnpm run dev


//gen api
npx react-swagger-openapi --input http://localhost:8802/swagger/v1/swagger.json --output ./src/apis/temp



// setting https
npm i vite-plugin-mkcert -D
mkdir -p .cert && mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem 'localhost'


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
    },
  },
  plugins: [react()],
});