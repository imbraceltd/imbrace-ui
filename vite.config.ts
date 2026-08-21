import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { extname, relative, resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            external: [
                'react',
                'react/jsx-runtime',
                '@tanstack/react-query',
                '@mui/material',
                '@tanstack/react-virtual',
                '@emotion/react',
                '@emotion/styled',
                '@mui/lab',
                'simplebar-react',
                'i18next',
                'react-i18next',
                'react-hook-form',
                'zod',
                'react-custom-scrollbars',
                'countries-and-timezones',
                'libphonenumber-js',
                'dayjs',
                'date-fns',
                '@ctrl/tinycolor',
                'react-colorful',
            ],
            input: Object.fromEntries(
                glob.sync('lib/**/*.{ts,tsx}', { ignore: ['lib/**/*.stories.tsx', 'lib/**/*.mdx'] }).map((file) => {
                    const entryName = relative('lib', file.slice(0, file.length - extname(file).length));
                    const entryUrl = fileURLToPath(new URL(file, import.meta.url));

                    return [entryName, entryUrl];
                }),
            ),
            output: {
                chunkFileNames: 'chunks/[name].[hash].js',
                assetFileNames: 'assets/[name][extname]',
                entryFileNames: '[name].js',
            },
            onwarn: (warning, defaultHandler) => {
                if (warning.code === 'SOURCEMAP_ERROR') {
                    return;
                }

                defaultHandler(warning);
            },
        },
        copyPublicDir: false,
    },
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
        }),
        libInjectCss(),
        dts({ include: ['lib'], exclude: ['**/*.stories.tsx', '**/*.mdx', '**/*.stories.ts'], insertTypesEntry: true }),
        svgr({
            svgrOptions: {
                plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
                svgoConfig: {
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                },
                            },
                        },
                        {
                            name: 'prefixIds',
                            params: {
                                prefix: () => `imbrace-svg-${Math.random().toString(36).substr(2, 9)}`,
                                delim: '-',
                                prefixClassNames: false,
                            },
                        },
                    ],
                },
                jsx: {
                    babelConfig: {
                        plugins: ['react-inline-svg-unique-id'],
                    },
                },
            },
        }),
    ],
    css: {
        modules: {
            generateScopedName: 'imbrace_[local]_[hash:base64:5]',
            hashPrefix: 'imbrace',
        },
    },
    esbuild: {
        include: /\.(js?|tsx?|jsx?)$/,
        exclude: [],
        loader: 'tsx',
    },
});
