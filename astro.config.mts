import { defineConfig, envField } from 'astro/config';
import UnoCSS from 'unocss/astro'
import node from '@astrojs/node';
import { SITE_URL } from './consts';
import db from '@astrojs/db';
import astrolace from '@matthiesenxyz/astrolace';
import { presetTypography, presetUno, presetWebFonts, presetWind } from 'unocss';
import { presetDaisy } from '@matthiesenxyz/unocss-preset-daisyui';

// https://astro.build/config
export default defineConfig({
    site: SITE_URL,
    output: 'server',
    adapter: node({
        mode: 'standalone'
    }),
    integrations: [
        db(),
        astrolace({
            verbose: true
        }),
        UnoCSS({
            injectReset: true,
            presets: [
                presetUno(),
                presetWind(),
                presetTypography(),
                presetDaisy({
                    themes: ['dark'],
                }),
                presetWebFonts({
                    provider: 'google',
                    fonts: {
                        sans: [
                            {
                                name: 'Poppins',
                                weights: ['400', '700'],
                            },
                        ],
                    }
                })
            ]
        }),
    ],
    experimental: {
        env: {
            schema: {
                OPENAI_API_KEY: envField.string({ context: "server", access: "secret" }),
                GITHUB_API_KEY: envField.string({ context: "server", access: "secret" }),
            },
        },
    }
});
