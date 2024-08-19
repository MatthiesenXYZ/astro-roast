import { defineConfig, envField } from 'astro/config';
import UnoCSS from 'unocss/astro'
import node from '@astrojs/node';
import { SITE_URL } from './consts';
import db from '@astrojs/db';
import astrolace from '@matthiesenxyz/astrolace';

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
        }),
    ],
    experimental: {
        env: {
            schema: {
                OPENAI_APIKEY: envField.string({ context: "server", access: "secret" }),
                GITHUB_APIKEY: envField.string({ context: "server", access: "secret" }),
            },
        },
    }
});
