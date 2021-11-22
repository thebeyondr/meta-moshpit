const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                display: ['Fondamento', ...defaultTheme.fontFamily.mono],
                mono: ['Space Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                'neon-green': '#39FF14',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
