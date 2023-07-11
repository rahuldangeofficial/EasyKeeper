import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_REACT_FIREBASE_API_KEY': JSON.stringify(process.env.VITE_REACT_FIREBASE_API_KEY),
    'process.env.VITE_REACT_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_REACT_FIREBASE_AUTH_DOMAIN),
    'process.env.VITE_REACT_FIREBASE_PROJECT_ID': JSON.stringify(process.env.VITE_REACT_FIREBASE_PROJECT_ID),
    'process.env.VITE_REACT_FIREBASE_BUCKET': JSON.stringify(process.env.VITE_REACT_FIREBASE_BUCKET),
    'process.env.VITE_REACT_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.VITE_REACT_FIREBASE_MESSAGING_SENDER_ID),
    'process.env.VITE_REACT_FIREBASE_APP_ID': JSON.stringify(process.env.VITE_REACT_FIREBASE_APP_ID),
    'process.env.VITE_REACT_FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.VITE_REACT_FIREBASE_MEASUREMENT_ID),
  },
  envDir: '.', // Look for .env file in the root directory
});
