import type { Config } from 'tailwindcss'
import headlessuiPlugin from '@headlessui/tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    plugins: [headlessuiPlugin],
}
export default config
