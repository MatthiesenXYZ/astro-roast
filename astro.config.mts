import db from '@astrojs/db';
import node from '@astrojs/node';
import astrolace from '@matthiesenxyz/astrolace';
import robotsTXT from 'astro-robots';
import { defineConfig, envField } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { SITE_URL } from './consts';

const siteUrl = process.env.NODE_ENV === 'production' ? SITE_URL : 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [
		db(),
		astrolace(),
		UnoCSS({ injectReset: true }),
		robotsTXT({
			host: siteUrl.replace(/^https?:\/\/|:\d+/g, ''),
			sitemap: false,
			policy: [
				{ userAgent: '*', allow: ['/'] },
				{ userAgent: '*', disallow: ['/api/'] },
			],
		}),
	],
	experimental: {
		env: {
			schema: {
				OPENAI_API_KEY: envField.string({ context: 'server', access: 'secret' }),
				GITHUB_API_KEY: envField.string({ context: 'server', access: 'secret' }),
			},
		},
	},
});
