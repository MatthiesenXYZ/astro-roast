import db from '@astrojs/db';
import node from '@astrojs/node';
import astrolace from '@matthiesenxyz/astrolace';
import { defineConfig, envField } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { SITE_URL } from './consts';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [db(), astrolace(), UnoCSS({ injectReset: true })],
	experimental: {
		env: {
			schema: {
				OPENAI_API_KEY: envField.string({ context: 'server', access: 'secret' }),
				GITHUB_API_KEY: envField.string({ context: 'server', access: 'secret' }),
			},
		},
	},
});
