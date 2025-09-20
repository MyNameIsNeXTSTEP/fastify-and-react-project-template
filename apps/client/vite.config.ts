import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
dayjs.extend(customParseFormat);

import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
// @ts-ignore
import { __dirname } from '../../system.js';

export default defineConfig(({ mode }) => {
  console.log('Current mode:', mode, '\n');
  const env = loadEnv(mode, __dirname, '');
  
  console.log('Loaded environment variables:', {
    VITE_WS_HOST: env.VITE_WS_HOST,
    VITE_WS_PORT: env.VITE_WS_PORT,
  }, '\n');

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    // plugins: [
    //   reactRouter(),
    //   tsconfigPaths({
    //     skip: (dir) => dir.includes('dist') || dir.includes('build'),
    //     root: __dirname,
    //     projects: ['./tsconfig.json'],
    //   }),
    // ],
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'app/components'),
        '@common': path.resolve(__dirname, 'app/common'),
        '@shared': path.resolve(__dirname, '../../shared'),
        '@pages': path.resolve(__dirname, 'app/pages'),
        '@api': path.resolve(__dirname, '../../shared/api'),
        '@store': path.resolve(__dirname, './app/store'),
        'dayjs': 'dayjs/esm/',
      },
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
      allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0'],
    },
    envDir: './',
    envPrefix: 'VITE_',
    define: {
      'import.meta.env.VITE_WS_HOST': JSON.stringify(env.VITE_WS_HOST),
      'import.meta.env.VITE_WS_PORT': JSON.stringify(env.VITE_WS_PORT),
      'import.meta.env.VITE_HTTP_API_URL': JSON.stringify(`http://${env.VITE_WS_HOST}:${env.VITE_WS_PORT}/api`),
    },
    optimizeDeps: {
      noDiscovery: true,
      include: [
        'prop-types',
        '@mantine/notifications',
        'dayjs',
        'mobx',
        'mobx-react',
        'fast-deep-equal',
        '@mantine/core',
        'lodash',
      ],
      exclude: [
        'src',
      ],
    },
    // build: {
    //   sourcemap: false,
    //   rollupOptions: {
    //     onwarn(warning, defaultHandler) {
    //       if (warning.code === 'SOURCEMAP_ERROR') return;
    //       defaultHandler(warning);
    //     },
    //   },
    // },
  };
});
