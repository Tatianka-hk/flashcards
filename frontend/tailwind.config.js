/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#f8d9d5',
                background: '#f4edf6',
                accent: '#84d3b6',
                danger: '#ed655e',
                text: '#4b4444',
                thirty: '#fde1f7',
                blue: '#d8e2ec',
                error: '#ed655e',
            },
        },
    },
    plugins: [],
}
