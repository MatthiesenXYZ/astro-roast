import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import { SITE_URL } from './consts';
import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
    site: SITE_URL,
    output: 'server',
    adapter: node({
        mode: 'standalone'
    }),
    integrations: [db()],
    experimental: {
        env: {
            schema: {
                OPENAI_APIKEY: envField.string({ context: "server", access: "secret" }),
                GITHUB_APIKEY: envField.string({ context: "server", access: "secret" }),
            },
        },
    }
});
