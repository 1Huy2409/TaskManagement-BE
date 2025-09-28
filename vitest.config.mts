import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    test: {
        environment: 'node',
        coverage: {

        },
        globals: true, // không cần import descibe, test, expect...
        restoreMocks: true
    },
    plugins: [tsconfigPaths()]
})