import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const config = ({ mode }: { mode: 'development' | 'production' }) => {
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
    return defineConfig({
        base: '/',
        plugins: [
            react({
                jsxImportSource: '@emotion/react',
            }),
            svgr({
                svgrOptions: {
                    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
                    svgoConfig: {
                        floatPrecision: 2,
                        plugins: [
                            {
                                name: 'preset-default',
                                params: {
                                    overrides: {
                                        removeViewBox: false,
                                        cleanupIds: false,
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
        define: {
            'process.env': {},
        },
        server: {
            open: false,
            port: 6007,
            proxy: {
                '/api': {
                    target: 'http://localhost:9001',
                    changeOrigin: true,
                    configure: (proxy) => {
                        proxy.on('proxyReq', function (proxyReq) {
                            console.log('Proxy to  => ', `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
                        });
                    },
                    rewrite: (reqPath) => reqPath.replace(/^\/api/, ''),
                    cookieDomainRewrite: {
                        'imbrace.co': '',
                    },
                },
            },
        },

        build: {
            outDir: 'build',
            target: browserslistToEsbuild(
                mode === 'development'
                    ? ['last 1 chrome version', 'last 15 firefox version', 'last 5 safari version']
                    : ['>0.2%', 'not dead', 'not op_mini all'],
            ),
        },
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
};

export default config;
