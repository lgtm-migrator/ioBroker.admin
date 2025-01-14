import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@honkhonk/vite-plugin-svgr';
import federation from '@dilesoft/vite-plugin-federation-dynamic';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react(),
            svgr(),
            viteCommonjs(),
            federation({
                // remotes: {
                //   CustomComponent: {
                //     external: 'Promise.resolve(\'\')',
                //     externalType: 'promise'
                //   }
                // },
                dynamicRemotes: true,
                shared: {
                    '@iobroker/adapter-react-v5': {
                        singleton: true,
                    },
                    react: {
                        singleton: true,
                        // requiredVersion: pkg.dependencies.react,
                    },
                    'react-dom': {
                        singleton: true,
                        // requiredVersion: pkg.dependencies['react-dom'],
                    },
                    '@mui/material': {
                        singleton: true,
                        // requiredVersion: pkg.dependencies['@mui/material'],
                    },
                    '@mui/styles': {
                        singleton: true,
                        // requiredVersion: pkg.dependencies['@mui/material'],
                    },
                    'react-ace': {
                        singleton: true,
                        // requiredVersion: pkg.dependencies['@mui/material'],
                    },
                    'prop-types': {
                        singleton: true,
                        // requiredVersion: pkg.dependencies['@mui/material'],
                    }
                }
            })
        ],
        server: {
            proxy: {
                '/files': 'http://localhost:8081',
                '/adapter': 'http://localhost:8081',
                '/session': 'http://localhost:8081',
                '/log': 'http://localhost:8081',
            }
        },
        build: {
            cssCodeSplit: false,
            sourcemap: true
        },
        optimizeDeps: {
            esbuildOptions: {
                define: {
                    global: 'globalThis'
                },
                plugins: [
                    // Solves:
                    // https://github.com/vitejs/vite/issues/5308
                    esbuildCommonjs(['@iobroker/adapter-react']),
                    NodeGlobalsPolyfillPlugin({
                        buffer: true
                    })
                ]
            }
        },
        base: './'
    };
});