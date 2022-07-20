import { esbuildPlugin } from '@web/dev-server-esbuild';

/**
 * @type {import('@web/test-runner').TestRunnerConfig}
 */
export default {
  files: [
    'lib/**/*.spec.ts'
  ],
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: 'tsconfig.lib.json'
    }),
  ],
  nodeResolve: true,
};
