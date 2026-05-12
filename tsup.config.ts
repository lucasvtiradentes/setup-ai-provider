import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	entry: ['src/index.ts', 'src/cleanup.ts'],
	format: ['cjs'],
	minify: false,
	noExternal: [/.*/],
	outDir: 'dist',
	outExtension: () => ({ js: '.js' }),
})
