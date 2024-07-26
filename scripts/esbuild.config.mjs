import esbuild from 'esbuild'
import process from 'process'
import builtins from 'builtin-modules'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

const banner = `#!/usr/bin/env node`

const prod = process.argv[2] === 'production'

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: ['./src/index.ts'],
  bundle: true,
  external: ['ora', 'execa', ...builtins],
  format: 'esm',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'dist/index.mjs',
  minify: true,
  plugins: [nodeExternalsPlugin()],
})

if (prod) {
  await context.rebuild()
  process.exit(0)
} else {
  await context.watch()
}
