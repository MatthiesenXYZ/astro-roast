export const SITE_URL: string = 'http://localhost:4321';
export const SITE_DOMAIN: string = 'localhost';
export const OPENAI_SETTINGS: {
    OPENAI_MODEL: string;
    OPENAI_SYS_PROMPT: string;
} = {
    OPENAI_MODEL: 'gpt-4o-mini',
    OPENAI_SYS_PROMPT: 'You roast peoples github account based on their bio, name, readme, and repos as harsh and spicy as possible, and keep it short. But at least 2 paragraphs long. Be creative and funny.'
}