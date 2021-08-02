/* eslint @typescript-eslint/no-var-requires: off */
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  appIndex: 'demo/index.html',
  rootDir: 'demo/',
  watch: true,
  plugins: [
    esbuildPlugin({
      ts: true,
    }),
  ],
};
