import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Dev only. The API's CORS allowlist does not include localhost in production,
// so the browser cannot call it directly. Proxying through Vite makes the request
// server-side (no Origin header), which the API accepts.
const DEV_API_TARGET = 'https://api.communityservices.org.au'

const READ_ONLY_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

// DEV_API_TARGET is the live production API, so refuse anything that could
// mutate real data from a developer's machine. Runs before Vite's proxy.
function blockProxiedApiWrites(): Plugin {
  return {
    name: 'acs-block-proxied-api-writes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        const method = (req.method ?? 'GET').toUpperCase()
        if (READ_ONLY_METHODS.has(method)) return next()

        res.statusCode = 403
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            success: false,
            message:
              `Blocked ${method} /api${req.url} — the dev proxy targets the production ` +
              `API and is read-only. Set VITE_API_URL to a local backend to make writes.`,
          })
        )
      })
    },
  }
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: DEV_API_TARGET,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    blockProxiedApiWrites(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-tiptap': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-link', '@tiptap/extension-placeholder', '@tiptap/extension-underline'],
          'vendor-charts': ['recharts'],
          'vendor-radix': [
            '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card', '@radix-ui/react-label', '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', '@radix-ui/react-progress',
            '@radix-ui/react-radio-group', '@radix-ui/react-scroll-area', '@radix-ui/react-select',
            '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-slot',
            '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
})
