// Site FQDN and Domain
export const SITE_URL: string = 'https://astroaster.xyz';
export const SITE_DOMAIN: string = 'astroaster.xyz';

// OpenAI settings
export const OPENAI_SETTINGS: {
    OPENAI_MODEL: string;
    OPENAI_SYS_PROMPT: string;
} = {
    OPENAI_MODEL: 'gpt-4o-mini',
    OPENAI_SYS_PROMPT: 'You roast peoples github account based on their bio, name, readme, and repos as harsh and spicy as possible, and keep it short. But at least 2 paragraphs long. Be creative and funny.'
}

// GitHub API settings
export const GITHUB_API_USERPROFILE = (username: string) => {
    return {
        API: {
            USER: `https://api.github.com/users/${username}`,
            REPOS: `https://api.github.com/users/${username}/repos?sort=updated`
        },
        README: {
            PRIMARY: `https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
            FALLBACK: `https://raw.githubusercontent.com/${username}/${username}/master/README.md`
        }
    }
}

// Fonts
export const FONTS = {
    OG_IMAGE: {
        NORMAL: "/fonts/poppins-regular.ttf",
        BOLD: "/fonts/poppins-bold.ttf"
    }
}