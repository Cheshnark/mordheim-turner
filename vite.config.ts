/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages sirve esto como sitio de proyecto (github.io/mordheim-turner/),
  // no en la raíz del dominio: solo build/preview de producción necesitan el
  // prefijo. `npm run dev` (mode 'development') y los tests (mode 'test')
  // siguen en '/' (docs/decisions.md). `command` no sirve aquí: `vite preview`
  // usa command 'serve' igual que dev, pero sí hereda mode 'production'.
  base: mode === 'production' ? '/mordheim-turner/' : '/',
  // Resuelve el alias @/ -> src/ desde tsconfig.app.json (soporte nativo de Vite 8).
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
}))
