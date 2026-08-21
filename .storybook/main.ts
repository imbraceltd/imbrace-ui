import { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
    stories: ['../lib/components/**/*.mdx', '../lib/components/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-designs',
        'storybook-react-i18next',
        '@storybook/addon-docs',
        '@storybook/addon-themes',
        '@storybook/addon-storysource',
    ],

    framework: {
        name: '@storybook/react-vite',
        options: {
            builder: {
                viteConfigPath: './vite.config.storybook.ts',
            },
        },
    },
    core: {
        builder: {
            name: '@storybook/builder-vite',
            options: {
                viteConfigPath: './vite.config.storybook.ts',
            },
        },
    },
    viteFinal: async (config) => {
        // modify the Vite config here
        return mergeConfig(config, {
            server: {
                ...config.server,
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
        });
    },

    features: {
        // previewMdx2: true,
    },

    typescript: {
        check: false,
        // checkOptions: {},
        reactDocgen: 'react-docgen',
        reactDocgenTypescriptOptions: {
            compilerOptions: {
                allowSyntheticDefaultImports: false,
                esModuleInterop: false,
            },
            // Makes union prop types like variant and size appear as select controls
            shouldExtractLiteralValuesFromEnum: true,
            // Makes string and boolean types that can be undefined appear as inputs and switches
            shouldRemoveUndefinedFromOptional: true,
            // Filter out third-party props from node_modules except @mui packages
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
            tsconfigPath: './tsconfig.json',
        },
    },

    docs: {
        autodocs: true,
    },
};

export default config;
