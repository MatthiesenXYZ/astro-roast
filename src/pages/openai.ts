import OpenAI from "openai";
import { OPENAI_API_KEY, GITHUB_API_KEY } from "astro:env/server";
import { SITE_DOMAIN } from "../../consts";
import type { APIContext, APIRoute } from "astro";
import { languages } from "../lib/supportedLanguages";
import { and, db, eq, RoastCollection } from "astro:db";

const client = new OpenAI({
    apiKey: OPENAI_API_KEY
});

let headers: Record<string, string> = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'User-Agent': SITE_DOMAIN
};

export const POST: APIRoute = async ( context: APIContext ): Promise<Response> => {
	const formData = await context.request.formData();

	const username = formData.get('username')?.toString();
	const language = formData.get('language')?.toString();

	if ( !username || !language ) {
		return new Response(JSON.stringify({ error: 'Missing username or language' }), {
			status: 400,
			headers
		});
	}

	if ( languages[language] == null || languages[language] == undefined ) {
		return new Response(JSON.stringify({ error: 'Invalid language' }), {
			status: 400,
			headers
		});
	}

	const existingRoastInCurrentLanguage = await db
		.select()
		.from(RoastCollection)
		.where(and(
			eq(RoastCollection.username, username),
			eq(RoastCollection.language, language)
		))
		.get();

	if (existingRoastInCurrentLanguage) {
		return new Response(JSON.stringify({ roast: existingRoastInCurrentLanguage.response }), {
			status: 200,
			headers
		});
	}

	if (GITHUB_API_KEY) {
		headers['Authorization'] = `token ${GITHUB_API_KEY}`;
	}

	var profileResponse: {
		name?: string;
		bio?: string;
		company?: string;
		location?: string;
		followers?: number;
		following?: number;
		public_repos?: number;
		status: number;
	} = { status: 403 };
	var useToken = false;

	try {
		let response = await fetch(`https://api.github.com/users/${username}`, { headers });

		profileResponse = await response.json();
		if (response.ok) {
			useToken = true;
		} else {
			return new Response(JSON.stringify({ error: 'Error fetching from Github, try again later.'}), { status: 500 });
		}
	} catch (error) {
		console.log(error);

		let response = await fetch(`https://api.github.com/users/${username}`, { headers });

		profileResponse = await response.json();
	}

	if (!useToken) {
		delete headers['Authorization'];
	}

	let response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`, {
		headers: headers
	});

	const repoResponse = await response.json();

	let readmeResponse
	try {
		response = await fetch(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`, { headers });

		if (response.ok) {
			readmeResponse = await response.text();
		}
	} catch (error) {
		console.log(error);

		try {
			response = await fetch(
				`https://raw.githubusercontent.com/${username}/${username}/master/README.md`,
				{ headers: headers }
			);
			if (response.ok) {
				readmeResponse = await response.text();
			}
		} catch (error) {
			console.log(error);
			console.log('failed to get readme');
			readmeResponse = '';
		}
	}

	const dataResponse = {
		name: profileResponse.name,
		bio: profileResponse.bio,
		company: profileResponse.company,
		location: profileResponse.location,
		followers: profileResponse.followers,
		following: profileResponse.following,
		public_repos: profileResponse.public_repos,
		profile_readme: readmeResponse,
		last_15_repositories: repoResponse.map((repo: any) => ({
			name: repo.name,
			description: repo.description,
			language: repo.language,
			stargazers_count: repo.stargazers_count,
			open_issues_count: repo.open_issues_count,
			license: repo.license,
			fork: repo.fork,
		}))
		.slice(0, 15)
	};

	let prompt = languages[language].buildPrompt(username, dataResponse);

	try {
		const completion = await client.chat.completions.create({
			model: 'gpt-4o-mini',
			stream: false,
			messages: [
				{
					role: 'system',
					content:
						'You roast people github account based on their bio, name, readme, and repos as harsh and spicy as possible, and keep it short.'
				},
				{ role: 'user', content: prompt }
			]
		});

		const roast = completion.choices[0].message.content;

		try {
			await db.insert(RoastCollection).values([
				{
					username: username,
					language: language,
					response: roast || "",
					createdAt: new Date(),
				}
			])
		} catch (error) {
			console.error('Error saving to database:', error);
		}

		return new Response(JSON.stringify({ roast }), { status: 200 });

	} catch (error) {
		console.error('Error:', error);
		return new Response(JSON.stringify({ error: 'Failed to generate roast' }), { status: 500 });
	}
}