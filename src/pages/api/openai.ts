import { RoastCollection, db } from 'astro:db';
import { GITHUB_API_KEY, OPENAI_API_KEY } from 'astro:env/server';
import type { APIContext, APIRoute } from 'astro';
import OpenAI from 'openai';
import { GITHUB_API_USERPROFILE, OPENAI_SETTINGS, SITE_DOMAIN } from '../../../consts';
import { jsonResponse } from '../../lib/jsonResponse';
import { getRoasts } from '../../lib/roastCollection';
import { languages } from '../../lib/supportedLanguages';

// Get OpenAI settings
const { OPENAI_MODEL, OPENAI_SYS_PROMPT } = OPENAI_SETTINGS;

// Initialize OpenAI client
const client = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

// Set headers for API requests
const headers: Record<string, string> = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'User-Agent': SITE_DOMAIN,
};

// Define the POST API route
export const POST: APIRoute = async (context: APIContext): Promise<Response> => {
	// Get form data from the request
	const formData = await context.request.formData();
	const username = formData.get('username')?.toString().trim();
	const language = formData.get('language')?.toString();

	console.log('username:', username);
	console.log('language:', language);

	// Validate username and language
	if (!username || !language) {
		return jsonResponse({ error: 'Missing username or language' }, 400);
	}

	// Check if the language is supported
	if (languages[language] == null || languages[language] === undefined) {
		return jsonResponse({ error: 'Invalid or Unsupported language' }, 400);
	}

	// Check if a roast already exists for the user in the specified language
	const existingRoastInCurrentLanguage = await (await getRoasts()).roastSelect(username, language);

	// If a roast exists, return it
	if (existingRoastInCurrentLanguage) {
		return jsonResponse({ roast: existingRoastInCurrentLanguage.response }, 200);
	}

	// If GitHub API key is provided, add it to the headers
	if (GITHUB_API_KEY) {
		headers.Authorization = `token ${GITHUB_API_KEY}`;
	}

	// Initialize profile response
	let profileResponse: {
		name?: string;
		bio?: string;
		company?: string;
		location?: string;
		followers?: number;
		following?: number;
		public_repos?: number;
		status: number;
	} = { status: 403 };

	// Flag to check if token is used
	let useToken = false;

	// Make the URL for GitHub API requests
	const { API, README } = GITHUB_API_USERPROFILE(username);

	// Fetch user profile from GitHub
	try {
		// Fetch user profile
		const response = await fetch(API.USER, { headers });

		// Parse the response
		profileResponse = await response.json();

		// Check if the response is OK
		if (response.ok) {
			// Set the flag to indicate that the token was used
			useToken = true;
		} else {
			// Log the error and return a 500 response
			return jsonResponse({ error: 'Error fetching from Github, try again later.' }, 500);
		}
	} catch (error) {
		// Log the error and try fetching without the token
		console.log(error);

		// Fetch user profile without the token
		const response = await fetch(API.USER, { headers });

		// Parse the response
		profileResponse = await response.json();
	}

	// Remove the Authorization header if the token was not used
	if (!useToken) {
		// biome-ignore lint/performance/noDelete: ignore
		delete headers.Authorization;
	}

	// Fetch repositories from GitHub
	let response = await fetch(API.REPOS, {
		headers: headers,
	});

	// Parse the response
	const repoResponse = await response.json();

	// Initialize readmeResponse
	let readmeResponse = '';

	// Fetch README from GitHub
	try {
		// Fetch README from the primary location
		response = await fetch(README.PRIMARY, { headers });

		// If the response is OK, get the text
		if (response.ok) {
			readmeResponse = await response.text();
		}
	} catch (error) {
		// Log the error and try fetching from the fallback location
		console.log(error);

		// Fetch README from the fallback location
		try {
			// Fetch README from the fallback location
			response = await fetch(README.FALLBACK, { headers: headers });

			// If the response is OK, get the text
			if (response.ok) {
				readmeResponse = await response.text();
			}
		} catch (error) {
			// Log the error and set readmeResponse to an empty string
			console.log('failed to get readme', error);
			readmeResponse = '';
		}
	}

	// Prepare data for OpenAI prompt
	const dataResponse = {
		name: profileResponse.name,
		bio: profileResponse.bio,
		company: profileResponse.company,
		location: profileResponse.location,
		followers: profileResponse.followers,
		following: profileResponse.following,
		public_repos: profileResponse.public_repos,
		profile_readme: readmeResponse,
		last_15_repositories: repoResponse
			.map((repo: any) => ({
				name: repo.name,
				description: repo.description,
				language: repo.language,
				stargazers_count: repo.stargazers_count,
				open_issues_count: repo.open_issues_count,
				license: repo.license,
				fork: repo.fork,
			}))
			.slice(0, 15),
	};

	// Build the prompt for OpenAI
	const prompt = languages[language].buildPrompt(username, dataResponse);

	// Generate roast using OpenAI
	try {
		// Call OpenAI API and get the roast
		const completion = await client.chat.completions.create({
			model: OPENAI_MODEL,
			stream: false,
			messages: [
				{ role: 'system', content: OPENAI_SYS_PROMPT },
				{ role: 'user', content: `Respond in the following Language: ${languages[language].name}` },
				{ role: 'user', content: prompt },
			],
		});

		// Extract roast from the response
		const roast = completion.choices[0].message.content;

		// Save roast to the database
		try {
			await db.insert(RoastCollection).values([
				{
					username: username,
					language: language,
					response: roast || '',
					createdAt: new Date(),
				},
			]);
		} catch (error) {
			// Log any errors while saving to the database
			console.error('Error saving to database:', error);
		}

		// Return the roast
		return jsonResponse({ roast }, 200);
	} catch (error) {
		// Log any errors from OpenAI API
		console.error('Error:', error);
		return jsonResponse({ error: 'Failed to generate roast' }, 500);
	}
};
