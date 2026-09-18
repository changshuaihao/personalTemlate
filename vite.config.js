import { fileURLToPath, URL } from 'node:url';
import WindiCSS from 'vite-plugin-windicss';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import PurgeIcons from 'vite-plugin-purge-icons';
export default defineConfig({
  plugins: [vue(), WindiCSS(), PurgeIcons({})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/personalTemlate/', //  资源路径添加上github仓库名
  server: {
    proxy: {
      '/api': {
        target: 'http://172.68.1.125:16000', // TODO 请修改为实际项目接口地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
