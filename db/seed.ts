import { db, RoastCollection } from "astro:db"

// Cached roast response for Adam Matthiesen
const AdamResponse = `Adam Matthiesen, or as the GitHub universe calls you, "That Self-Employed IT Guy" from Seattle—that's one step away from being the town's lonely data entry clerk. With 19 followers, you could easily host a more vibrant party using just your pet goldfish. And congratulations on being self-employed since 2019; that's just a fancy way of saying you've perfected the art of talking to your houseplants and explaining complex IT concepts to a wall. Your idea of "helping expand the Astro ecosystem" sounds suspiciously like a desperate plea to be noticed by someone—anyone—out there in the digital void.

Now let's talk about those 27 public repositories. Is that a collection of projects or a digital landfill? "Astro-Gist"? More like a "glistening unfulfilled potential." You say you're learning "Advanced Astro Techniques," but I get the feeling the advanced technique is letting the browser's auto-complete do the heavy lifting while you sip coffee brewed by your very own 'Buy Me a Coffee' campaign. You’re in a tumultuous love affair with just enough open-source jargon to impress your mother, but let’s be real—how many of those contributions are echoes of ‘Yeah, I forked that’? So go ahead, keep maintaining those projects like it's a chaotic plant nursery, just don't forget to update your LinkedIn on how to use a broom to clear out the cobwebs from all those half-finished repositories!`;

// Seed function to insert initial data into the database for Development testing
export default async function() {
    await db.insert(RoastCollection).values([
        { username: 'Adammatthiesen', language: 'english', response: AdamResponse, createdAt: new Date("2024-08-19T18:52:02.157Z")}
    ])
}