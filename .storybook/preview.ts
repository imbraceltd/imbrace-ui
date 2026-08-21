import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';
import './index.css';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { Preview } from '@storybook/react';
import i18next from 'i18next';
import detector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import cn from '../lib/translations/cn.json';
import en from '../lib/translations/en.json';
import zh from '../lib/translations/zh.json';

const theme = (mode: 'light' | 'dark') => ({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 1024,
            lg: 1440,
            xl: 1920,
        },
    },
    palette: {
        mode,
        primary: {
            main: '#156df2',
        },
        imbrace_blue: {
            main: '#156DF2',
            contrastText: '#fff',
        },
        imbrace_orange: {
            main: '#FA9917',
            contrastText: '#fff',
        },
        imbrace_red: {
            main: '#F36',
            contrastText: '#fff',
        },
        imbrace_grey: {
            main: '#E0E0E0',
            contrastText: '#fff',
        },
        noti_btn_secondary: {
            main: '#bdbdbd',
            darker: '#bdbdbd',
        },
        error: {
            main: '#E53C3C',
        },
        leave_btn: {
            main: '#bdbdbd',
            contrastText: '#fff',
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    color: 'var(--color-light-7)',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'var(--color-secondary-4)',
                },
            },
        },
    },
});

i18next
    .use(initReactI18next)
    .use(detector)
    .use(Backend)
    .init({
        resources: {
            en: { translation: en },
            cn: { translation: cn },
            zh: { translation: zh },
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
        nsSeparator: false,
        keySeparator: false,
        returnEmptyString: false,
        interpolation: {
            escapeValue: false,
        },
    });

const preview: Preview = {
    decorators: [
        withThemeFromJSXProvider({
            GlobalStyles: CssBaseline,
            Provider: ThemeProvider,
            themes: {
                // Provide your custom themes here
                light: createTheme(theme('light')),
                dark: createTheme(theme('dark')),
            },
            defaultTheme: 'light',
        }),
        (Story) => {
            return Story();
        },
    ],
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
            expanded: true,
        },
        // i18n: i18next,
    },
    globals: {
        locale: 'en',
        locales: {
            en: { title: 'English', left: '🇺🇸' },
            zh: { title: '繁體中文', left: '🇭🇰' },
            cn: { title: '简体中文', left: '🇨🇳' },
        },
    },

    globalTypes: {
        theme: {
            name: 'Theme',
            title: 'Theme',
            description: 'Theme for your components',
            defaultValue: 'light',
            toolbar: {
                icon: 'paintbrush',
                dynamicTitle: true,
                items: [
                    { value: 'light', left: '☀️', title: 'Light mode' },
                    { value: 'dark', left: '🌙', title: 'Dark mode' },
                ],
            },
        },
    },
};

export default preview;
